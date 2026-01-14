import type { Question } from '~/types'
import { shuffle } from '~/utils/shuffle'
import { shuffleOptions } from '~/composables/useQuiz'

export interface UseStudySessionOptions {
  /** Source questions to study from */
  questions: ComputedRef<Question[]> | Ref<Question[]>
}

export function useStudySession(options: UseStudySessionOptions) {
  const route = useRoute()
  const router = useRouter()

  // Study state
  const isStudying = ref(false)
  const currentIndex = ref(0)
  const highlightedAnswer = ref<number | null>(null)
  const confirmedAnswer = ref<number | null>(null)
  const studyQuestions = ref<Question[]>([])
  const answeredCount = ref(0)
  const correctCount = ref(0)

  // Computed
  const hasAnswered = computed(() => confirmedAnswer.value !== null)
  const currentQuestion = computed(() => studyQuestions.value[currentIndex.value])
  const isLastQuestion = computed(() => currentIndex.value === studyQuestions.value.length - 1)
  const totalQuestions = computed(() => studyQuestions.value.length)

  function initStudySession() {
    const sourceQuestions = unref(options.questions)
    studyQuestions.value = shuffle([...sourceQuestions]).map(shuffleOptions)
    currentIndex.value = 0
    highlightedAnswer.value = null
    confirmedAnswer.value = null
    answeredCount.value = 0
    correctCount.value = 0
    isStudying.value = true
  }

  function startStudy() {
    initStudySession()
    router.push({ query: { mode: 'study' } })
  }

  function highlightAnswer(index: number) {
    if (hasAnswered.value) return
    highlightedAnswer.value = index
  }

  function confirmAnswer() {
    if (hasAnswered.value || highlightedAnswer.value === null) return
    confirmedAnswer.value = highlightedAnswer.value
    answeredCount.value++
    if (confirmedAnswer.value === currentQuestion.value.correctIndex) {
      correctCount.value++
    }
  }

  function handleOptionClick(index: number) {
    if (hasAnswered.value) return
    if (highlightedAnswer.value === index) {
      // Second click on same option confirms it
      confirmAnswer()
    } else {
      // First click highlights
      highlightAnswer(index)
    }
  }

  function nextQuestion() {
    if (currentIndex.value < studyQuestions.value.length - 1) {
      currentIndex.value++
      highlightedAnswer.value = null
      confirmedAnswer.value = null
    }
  }

  function previousQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--
      highlightedAnswer.value = null
      confirmedAnswer.value = null
    }
  }

  function exitStudy() {
    isStudying.value = false
    highlightedAnswer.value = null
    confirmedAnswer.value = null
    router.push({ query: {} })
  }

  // Watch for route changes (handles browser back button)
  watch(
    () => route.query.mode,
    (newMode) => {
      if (newMode === 'study' && !isStudying.value) {
        initStudySession()
      } else if (!newMode && isStudying.value) {
        isStudying.value = false
        highlightedAnswer.value = null
        confirmedAnswer.value = null
      }
    }
  )

  // Initialize study mode if URL has mode=study on mount
  onMounted(() => {
    if (route.query.mode === 'study') {
      initStudySession()
    }
  })

  // Keyboard navigation
  useKeyboardNav({
    onSelectAnswer: highlightAnswer,
    onNext: () => {
      // If not answered yet but something is highlighted, confirm it
      if (!hasAnswered.value && highlightedAnswer.value !== null) {
        confirmAnswer()
        return
      }
      // If answered, go to next question
      if (hasAnswered.value) {
        if (isLastQuestion.value) {
          exitStudy()
        } else {
          nextQuestion()
        }
      }
    },
    onPrevious: previousQuestion,
    currentAnswer: highlightedAnswer,
    enabled: isStudying,
  })

  // Style helper functions
  function getOptionClass(optIndex: number): string {
    if (!hasAnswered.value) {
      return highlightedAnswer.value === optIndex
        ? 'bg-primary-50 border-primary-300'
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
    }

    const isCorrect = optIndex === currentQuestion.value.correctIndex
    const isSelected = optIndex === confirmedAnswer.value

    if (isCorrect) {
      return 'bg-success-50 border-success'
    }
    if (isSelected && !isCorrect) {
      return 'bg-error-50 border-error'
    }
    return 'bg-gray-50 border-gray-200'
  }

  function getLetterClass(optIndex: number): string {
    if (!hasAnswered.value) {
      return highlightedAnswer.value === optIndex
        ? 'bg-primary text-white'
        : 'bg-gray-200 text-gray-600'
    }

    const isCorrect = optIndex === currentQuestion.value.correctIndex
    const isSelected = optIndex === confirmedAnswer.value

    if (isCorrect) {
      return 'bg-success text-white'
    }
    if (isSelected && !isCorrect) {
      return 'bg-error text-white'
    }
    return 'bg-gray-200 text-gray-600'
  }

  return {
    // State
    isStudying: readonly(isStudying),
    currentIndex: readonly(currentIndex),
    highlightedAnswer: readonly(highlightedAnswer),
    confirmedAnswer: readonly(confirmedAnswer),
    studyQuestions: readonly(studyQuestions),
    answeredCount: readonly(answeredCount),
    correctCount: readonly(correctCount),

    // Computed
    hasAnswered,
    currentQuestion,
    isLastQuestion,
    totalQuestions,

    // Actions
    startStudy,
    highlightAnswer,
    confirmAnswer,
    handleOptionClick,
    nextQuestion,
    previousQuestion,
    exitStudy,

    // Style helpers
    getOptionClass,
    getLetterClass,
  }
}
