import type { Question, Category, FlashcardStatus, FlashcardStoredStatus, FlashcardProgress } from '~/types'
import questionsData from '@@/data/questions.json'
import { shuffle } from '~/utils/shuffle'

export const FLASHCARDS_STORAGE_KEY = 'examen-civique-flashcards'

/** Animation duration in ms - must match CSS transition-transform duration */
export const FLIP_ANIMATION_DURATION_MS = 500

export const defaultFlashcardProgress: FlashcardProgress = {
  cards: {},
  lastSession: null,
  totalReviewed: 0,
}

function loadProgress(): FlashcardProgress {
  if (import.meta.server) return { ...defaultFlashcardProgress }

  try {
    const stored = localStorage.getItem(FLASHCARDS_STORAGE_KEY)
    if (stored) {
      return { ...defaultFlashcardProgress, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.warn('[useFlashcards] Failed to load progress from localStorage:', error)
  }
  return { ...defaultFlashcardProgress }
}

function saveProgress(progress: FlashcardProgress): void {
  if (import.meta.server) return

  try {
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.warn('[useFlashcards] Failed to save progress to localStorage:', error)
  }
}

export function useFlashcards() {
  const allQuestions = questionsData.questions as Question[]

  const progress = useState<FlashcardProgress>('flashcard-progress', () => loadProgress())
  // Track if client-side localStorage data has been loaded.
  // SSR returns defaults, then onMounted loads real data from localStorage.
  // This may cause a brief flash of default values on hydration - acceptable trade-off for localStorage.
  const isLoaded = useState('flashcards-loaded', () => false)
  const currentDeck = ref<Question[]>([])
  const currentIndex = ref(0)
  const isFlipped = ref(false)
  const isAnimating = ref(false)

  onMounted(() => {
    if (!isLoaded.value) {
      progress.value = loadProgress()
      isLoaded.value = true
    }
  })

  const currentCard = computed(() => currentDeck.value[currentIndex.value] || null)

  const deckStats = computed(() => {
    const total = currentDeck.value.length
    const known = currentDeck.value.filter(q => getCardStatus(q.id) === 'known').length
    const needsReview = currentDeck.value.filter(q => getCardStatus(q.id) === 'needs-review').length
    const unseen = total - known - needsReview
    return { total, known, needsReview, unseen }
  })

  const globalStats = computed(() => {
    const cards = progress.value.cards
    const known = Object.values(cards).filter(s => s === 'known').length
    const needsReview = Object.values(cards).filter(s => s === 'needs-review').length
    const unseen = allQuestions.length - known - needsReview
    return {
      total: allQuestions.length,
      known,
      needsReview,
      unseen,
      totalReviewed: progress.value.totalReviewed,
    }
  })

  function getCardStatus(questionId: string): FlashcardStatus {
    return progress.value.cards[questionId] || 'unseen'
  }

  function startSession(options: { category?: Category; filter?: FlashcardStatus } = {}): void {
    let questions = [...allQuestions]

    if (options.category) {
      questions = questions.filter(q => q.category === options.category)
    }

    if (options.filter) {
      if (options.filter === 'unseen') {
        questions = questions.filter(q => progress.value.cards[q.id] === undefined)
      } else {
        questions = questions.filter(q => progress.value.cards[q.id] === options.filter)
      }
    }

    currentDeck.value = shuffle(questions)
    currentIndex.value = 0
    isFlipped.value = false
  }

  function flipCard(): void {
    isFlipped.value = !isFlipped.value
  }

  function markCard(status: FlashcardStoredStatus): void {
    if (!currentCard.value || isAnimating.value) return

    const wasUnseen = progress.value.cards[currentCard.value.id] === undefined
    progress.value.cards[currentCard.value.id] = status

    if (wasUnseen) {
      progress.value.totalReviewed++
    }

    progress.value.lastSession = new Date().toISOString()
    saveProgress(progress.value)

    // Advance to next card automatically after flip animation
    if (currentIndex.value < currentDeck.value.length - 1) {
      isAnimating.value = true
      // First flip back to front
      isFlipped.value = false
      // Wait for animation then move to next card
      setTimeout(() => {
        currentIndex.value++
        isAnimating.value = false
      }, FLIP_ANIMATION_DURATION_MS)
    }
  }

  function nextCard(): void {
    if (currentIndex.value < currentDeck.value.length - 1) {
      currentIndex.value++
      isFlipped.value = false
    }
  }

  function previousCard(): void {
    if (currentIndex.value > 0) {
      currentIndex.value--
      isFlipped.value = false
    }
  }

  function resetProgress(): void {
    progress.value = { ...defaultFlashcardProgress }
    saveProgress(progress.value)
  }

  function getCategoryStats(category: Category) {
    const questions = allQuestions.filter(q => q.category === category)
    const known = questions.filter(q => getCardStatus(q.id) === 'known').length
    const needsReview = questions.filter(q => getCardStatus(q.id) === 'needs-review').length
    const unseen = questions.length - known - needsReview
    return {
      total: questions.length,
      known,
      needsReview,
      unseen,
    }
  }

  return {
    progress: readonly(progress),
    isLoaded: readonly(isLoaded),
    currentDeck: readonly(currentDeck),
    currentCard,
    currentIndex: readonly(currentIndex),
    isFlipped: readonly(isFlipped),
    deckStats,
    globalStats,
    getCardStatus,
    getCategoryStats,
    startSession,
    flipCard,
    markCard,
    nextCard,
    previousCard,
    resetProgress,
  }
}
