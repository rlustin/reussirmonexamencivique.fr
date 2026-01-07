import type { Category, QuizResult, UserProgress } from '~/types'
import { CATEGORIES, DEFAULT_CATEGORY_STATS } from '~/constants/exam'

export const STORAGE_KEY = 'examen-civique-progress'

export const defaultProgress: UserProgress = {
  quizzesTaken: 0,
  bestScore: 0,
  lastQuizDate: '',
  categoryStats: { ...DEFAULT_CATEGORY_STATS },
}

/**
 * Calculate category performance from stats
 */
export function calculateCategoryPerformance(
  categoryStats: Record<Category, { attempts: number; correct: number }>
) {
  return CATEGORIES.map((cat) => {
    const { attempts, correct } = categoryStats[cat]
    const percentage = attempts > 0 ? Math.round((correct / attempts) * 100) : null

    return {
      category: cat,
      attempts,
      correct,
      percentage,
    }
  })
}

/**
 * Calculate weak categories (below 80% success rate)
 */
export function calculateWeakCategories(
  categoryPerformance: ReturnType<typeof calculateCategoryPerformance>
) {
  return categoryPerformance
    .filter((c) => c.percentage !== null && c.percentage < 80)
    .sort((a, b) => (a.percentage ?? 0) - (b.percentage ?? 0))
    .slice(0, 2)
}

/**
 * Calculate average score from category stats
 */
export function calculateAverageScore(
  categoryStats: Record<Category, { attempts: number; correct: number }>
): number | null {
  const totalAttempts = Object.values(categoryStats).reduce(
    (sum, cat) => sum + cat.attempts,
    0
  )
  const totalCorrect = Object.values(categoryStats).reduce(
    (sum, cat) => sum + cat.correct,
    0
  )

  return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null
}

function loadProgress(): UserProgress {
  if (import.meta.server) return { ...defaultProgress }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...defaultProgress,
        ...parsed,
        categoryStats: {
          ...defaultProgress.categoryStats,
          ...parsed.categoryStats,
        },
      }
    }
  } catch {
    // Invalid data, use default
  }
  return { ...defaultProgress }
}

function saveProgress(progress: UserProgress): void {
  if (import.meta.server) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage full or unavailable
  }
}

export function useProgress() {
  const progress = useState<UserProgress>('user-progress', () => loadProgress())
  const isLoaded = useState('progress-loaded', () => false)

  // Load from localStorage on client-side
  onMounted(() => {
    if (!isLoaded.value) {
      progress.value = loadProgress()
      isLoaded.value = true
    }
  })

  function recordQuizResult(result: QuizResult): void {
    const newProgress = { ...progress.value }

    newProgress.quizzesTaken++
    newProgress.lastQuizDate = new Date().toISOString()

    if (result.score > newProgress.bestScore) {
      newProgress.bestScore = result.score
    }

    // Update category stats
    const categories = Object.keys(result.categoryScores) as Category[]
    for (const category of categories) {
      const catResult = result.categoryScores[category]
      newProgress.categoryStats[category].attempts += catResult.total
      newProgress.categoryStats[category].correct += catResult.correct
    }

    progress.value = newProgress
    saveProgress(newProgress)
  }

  function resetProgress(): void {
    progress.value = { ...defaultProgress }
    saveProgress(progress.value)
  }

  const hasProgress = computed(() => {
    return progress.value.quizzesTaken > 0
  })

  const lastQuizFormatted = computed(() => {
    if (!progress.value.lastQuizDate) return null

    const date = new Date(progress.value.lastQuizDate)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })

  const categoryPerformance = computed(() => {
    return calculateCategoryPerformance(progress.value.categoryStats)
  })

  const weakCategories = computed(() => {
    return calculateWeakCategories(categoryPerformance.value)
  })

  const averageScore = computed(() => {
    if (progress.value.quizzesTaken === 0) return null
    return calculateAverageScore(progress.value.categoryStats)
  })

  return {
    progress: readonly(progress),
    hasProgress,
    lastQuizFormatted,
    categoryPerformance,
    weakCategories,
    averageScore,
    recordQuizResult,
    resetProgress,
  }
}
