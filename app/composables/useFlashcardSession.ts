import type { Category, FlashcardStatus, FlashcardStoredStatus } from '~/types'

const VALID_FILTERS: FlashcardStatus[] = ['known', 'needs-review', 'unseen']

function parseFlashcardFilter(value: unknown): FlashcardStatus | undefined {
  if (typeof value === 'string' && VALID_FILTERS.includes(value as FlashcardStatus)) {
    return value as FlashcardStatus
  }
  return undefined
}

interface UseFlashcardSessionOptions {
  category?: Ref<Category> | ComputedRef<Category>
}

export function useFlashcardSession(options: UseFlashcardSessionOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  const {
    currentDeck,
    currentCard,
    currentIndex,
    isFlipped,
    deckStats,
    startSession,
    flipCard,
    markCard,
    nextCard,
    previousCard,
  } = useFlashcards()

  const isInSession = ref(false)
  const currentFilter = ref<FlashcardStatus | null>(null)

  const canGoBack = computed(() => currentIndex.value > 0)
  const canGoForward = computed(() => currentIndex.value < currentDeck.value.length - 1)

  function getSessionOptions(filter?: FlashcardStatus) {
    const sessionOptions: { category?: Category; filter?: FlashcardStatus } = {}
    if (options.category) {
      sessionOptions.category = unref(options.category)
    }
    if (filter) {
      sessionOptions.filter = filter
    }
    return sessionOptions
  }

  function startAllCards() {
    startSession(getSessionOptions())
    currentFilter.value = null
    isInSession.value = true
    router.push({ query: { mode: 'session' } })
  }

  function startFilteredCards(filter: FlashcardStatus) {
    startSession(getSessionOptions(filter))
    currentFilter.value = filter
    isInSession.value = true
    router.push({ query: { mode: 'session', filter } })
  }

  function exitSession() {
    isInSession.value = false
    currentFilter.value = null
    router.push({ query: {} })
  }

  function handleMark(status: FlashcardStoredStatus) {
    markCard(status)
  }

  // Keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (!isInSession.value) return

    switch (event.key) {
      case ' ':
        event.preventDefault()
        flipCard()
        break
      case 'ArrowLeft':
        event.preventDefault()
        previousCard()
        break
      case 'ArrowRight':
        event.preventDefault()
        nextCard()
        break
      case '1':
        if (isFlipped.value) {
          event.preventDefault()
          handleMark('needs-review')
        }
        break
      case '2':
        if (isFlipped.value) {
          event.preventDefault()
          handleMark('known')
        }
        break
      case 'Escape':
        event.preventDefault()
        exitSession()
        break
    }
  }

  // Watch for route changes (handles browser back button and filter changes)
  // Using immediate: true handles initialization on mount
  watch(
    () => ({ mode: route.query.mode, filter: route.query.filter }),
    (newQuery, oldQuery) => {
      const newMode = newQuery.mode
      const newFilter = parseFlashcardFilter(newQuery.filter)

      if (newMode === 'session') {
        // Start or restart session if mode changed to session, or filter changed while in session
        const filterChanged = oldQuery && oldQuery.mode === 'session' && newQuery.filter !== oldQuery.filter
        if (!isInSession.value || filterChanged) {
          startSession(getSessionOptions(newFilter))
          currentFilter.value = newFilter ?? null
          isInSession.value = true
        }
      } else if (isInSession.value) {
        // Exit session when mode is removed
        isInSession.value = false
        currentFilter.value = null
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    // State
    isInSession: readonly(isInSession),
    currentFilter: readonly(currentFilter),
    currentDeck,
    currentCard,
    currentIndex,
    isFlipped,
    deckStats,
    canGoBack,
    canGoForward,
    // Actions
    startAllCards,
    startFilteredCards,
    exitSession,
    handleMark,
    flipCard,
    nextCard,
    previousCard,
  }
}
