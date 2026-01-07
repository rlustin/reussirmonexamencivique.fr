import type { Question, QuizState, QuizResult, Category } from '~/types'
import questionsData from '../../data/questions.json'
import { useProgress } from './useProgress'
import { shuffle } from '~/utils/shuffle'
import { CATEGORIES, EXAM_CONFIG } from '~/constants/exam'

/**
 * Shuffles the options of a question while maintaining the correct answer tracking
 */
export function shuffleOptions(question: Question): Question {
  const correctAnswer = question.options[question.correctIndex]
  const shuffledOptions = shuffle([...question.options])
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswer)

  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
  }
}

/**
 * Selects a set of questions for a quiz: 8 situational + 32 general
 */
export function selectQuestions(allQuestions: Question[]): Question[] {
  const situational = allQuestions.filter(q => q.isSituational)
  const general = allQuestions.filter(q => !q.isSituational)

  // Select situational and general questions based on exam config
  const selected: Question[] = [
    ...shuffle(situational).slice(0, EXAM_CONFIG.situationalQuestions),
    ...shuffle(general).slice(0, EXAM_CONFIG.generalQuestions),
  ]

  return shuffle(selected).map(shuffleOptions)
}

export function useQuiz() {
  const allQuestions = questionsData.questions as Question[]
  const { recordQuizResult } = useProgress()

  const quizState = useState<QuizState | null>('quiz-state', () => null)
  const quizResult = useState<QuizResult | null>('quiz-result', () => null)

  function startQuiz() {
    const selected = selectQuestions(allQuestions)
    quizState.value = {
      questions: selected,
      currentIndex: 0,
      answers: new Array(EXAM_CONFIG.totalQuestions).fill(null),
      startTime: Date.now(),
      isFinished: false,
    }
    quizResult.value = null
  }

  function selectAnswer(answerIndex: number) {
    if (!quizState.value || quizState.value.isFinished) return
    quizState.value.answers[quizState.value.currentIndex] = answerIndex
  }

  function goToQuestion(index: number) {
    if (!quizState.value || quizState.value.isFinished) return
    if (index >= 0 && index < quizState.value.questions.length) {
      quizState.value.currentIndex = index
    }
  }

  function nextQuestion() {
    if (!quizState.value) return
    if (quizState.value.currentIndex < quizState.value.questions.length - 1) {
      quizState.value.currentIndex++
    }
  }

  function previousQuestion() {
    if (!quizState.value) return
    if (quizState.value.currentIndex > 0) {
      quizState.value.currentIndex--
    }
  }

  function finishQuiz(): QuizResult | null {
    if (!quizState.value) return null

    quizState.value.isFinished = true
    const timeSpent = Math.floor((Date.now() - quizState.value.startTime) / 1000)

    const categoryScores = CATEGORIES.reduce((acc, cat) => {
      acc[cat] = { correct: 0, total: 0 }
      return acc
    }, {} as Record<Category, { correct: number; total: number }>)

    const answersDetail: QuizResult['answers'] = []
    let score = 0

    quizState.value.questions.forEach((question, index) => {
      const userAnswer = quizState.value!.answers[index]
      const isCorrect = userAnswer === question.correctIndex

      if (isCorrect) {
        score++
        categoryScores[question.category].correct++
      }
      categoryScores[question.category].total++

      answersDetail.push({
        question,
        userAnswer,
        isCorrect,
      })
    })

    quizResult.value = {
      score,
      total: EXAM_CONFIG.totalQuestions,
      passed: score >= EXAM_CONFIG.passingScore,
      timeSpent,
      categoryScores,
      answers: answersDetail,
    }

    // Record the result in user progress
    recordQuizResult(quizResult.value)

    return quizResult.value
  }

  function resetQuiz() {
    quizState.value = null
    quizResult.value = null
  }

  const currentQuestion = computed(() => {
    if (!quizState.value) return null
    return quizState.value.questions[quizState.value.currentIndex]
  })

  const currentAnswer = computed(() => {
    if (!quizState.value) return null
    return quizState.value.answers[quizState.value.currentIndex]
  })

  const progress = computed(() => {
    if (!quizState.value) return { current: 0, total: 0, answered: 0 }
    return {
      current: quizState.value.currentIndex + 1,
      total: quizState.value.questions.length,
      answered: quizState.value.answers.filter(a => a !== null).length,
    }
  })

  const isFirstQuestion = computed(() => {
    return quizState.value?.currentIndex === 0
  })

  const isLastQuestion = computed(() => {
    if (!quizState.value) return false
    return quizState.value.currentIndex === quizState.value.questions.length - 1
  })

  return {
    quizState: readonly(quizState),
    quizResult: readonly(quizResult),
    currentQuestion,
    currentAnswer,
    progress,
    isFirstQuestion,
    isLastQuestion,
    startQuiz,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    resetQuiz,
  }
}
