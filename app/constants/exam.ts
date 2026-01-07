import type { Category } from '~/types'

/**
 * All available exam categories in display order
 */
export const CATEGORIES: Category[] = [
  'principes-valeurs',
  'systeme-institutionnel',
  'droits-devoirs',
  'histoire-geographie-culture',
  'vivre-societe',
]

/**
 * Exam configuration constants
 * Based on the official French civic exam format (2026 reform)
 */
export const EXAM_CONFIG = {
  /** Total number of questions in a quiz */
  totalQuestions: 40,
  /** Number of situational questions per quiz */
  situationalQuestions: 8,
  /** Number of general knowledge questions per quiz */
  generalQuestions: 32,
  /** Minimum score to pass (80%) */
  passingScore: 32,
  /** Quiz duration in seconds (45 minutes) */
  durationSeconds: 2700,
  /** Warning threshold in seconds (5 minutes remaining) */
  warningThresholdSeconds: 300,
} as const

/**
 * Default category stats for initializing progress
 */
export const DEFAULT_CATEGORY_STATS: Record<Category, { attempts: number; correct: number }> = {
  'principes-valeurs': { attempts: 0, correct: 0 },
  'systeme-institutionnel': { attempts: 0, correct: 0 },
  'droits-devoirs': { attempts: 0, correct: 0 },
  'histoire-geographie-culture': { attempts: 0, correct: 0 },
  'vivre-societe': { attempts: 0, correct: 0 },
}
