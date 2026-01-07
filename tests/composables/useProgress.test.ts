import { describe, it, expect } from 'vitest'
import {
  calculateCategoryPerformance,
  calculateWeakCategories,
  calculateAverageScore,
  defaultProgress,
  STORAGE_KEY,
} from '../../app/composables/useProgress'
import { DEFAULT_CATEGORY_STATS, CATEGORIES } from '../../app/constants/exam'
import type { Category } from '../../types'

describe('defaultProgress', () => {
  it('has correct default values', () => {
    expect(defaultProgress.quizzesTaken).toBe(0)
    expect(defaultProgress.bestScore).toBe(0)
    expect(defaultProgress.lastQuizDate).toBe('')
  })

  it('has all categories in categoryStats', () => {
    CATEGORIES.forEach((cat) => {
      expect(defaultProgress.categoryStats[cat]).toBeDefined()
      expect(defaultProgress.categoryStats[cat].attempts).toBe(0)
      expect(defaultProgress.categoryStats[cat].correct).toBe(0)
    })
  })
})

describe('STORAGE_KEY', () => {
  it('has the expected value', () => {
    expect(STORAGE_KEY).toBe('examen-civique-progress')
  })
})

describe('calculateCategoryPerformance', () => {
  it('returns performance for all categories', () => {
    const performance = calculateCategoryPerformance(DEFAULT_CATEGORY_STATS)
    expect(performance).toHaveLength(CATEGORIES.length)
  })

  it('returns null percentage when no attempts', () => {
    const performance = calculateCategoryPerformance(DEFAULT_CATEGORY_STATS)
    performance.forEach((p) => {
      expect(p.percentage).toBeNull()
    })
  })

  it('calculates correct percentage', () => {
    const stats: Record<Category, { attempts: number; correct: number }> = {
      ...DEFAULT_CATEGORY_STATS,
      'principes-valeurs': { attempts: 10, correct: 8 },
    }

    const performance = calculateCategoryPerformance(stats)
    const principesPerf = performance.find((p) => p.category === 'principes-valeurs')

    expect(principesPerf?.percentage).toBe(80)
    expect(principesPerf?.attempts).toBe(10)
    expect(principesPerf?.correct).toBe(8)
  })

  it('rounds percentage to nearest integer', () => {
    const stats: Record<Category, { attempts: number; correct: number }> = {
      ...DEFAULT_CATEGORY_STATS,
      'principes-valeurs': { attempts: 3, correct: 1 }, // 33.33%
    }

    const performance = calculateCategoryPerformance(stats)
    const principesPerf = performance.find((p) => p.category === 'principes-valeurs')

    expect(principesPerf?.percentage).toBe(33)
  })
})

describe('calculateWeakCategories', () => {
  it('returns empty array when all categories are at or above 80%', () => {
    const performance = CATEGORIES.map((cat) => ({
      category: cat,
      attempts: 10,
      correct: 8,
      percentage: 80,
    }))

    const weak = calculateWeakCategories(performance)
    expect(weak).toHaveLength(0)
  })

  it('returns categories below 80%', () => {
    const performance = [
      { category: 'principes-valeurs' as Category, attempts: 10, correct: 7, percentage: 70 },
      { category: 'systeme-institutionnel' as Category, attempts: 10, correct: 9, percentage: 90 },
      { category: 'droits-devoirs' as Category, attempts: 10, correct: 6, percentage: 60 },
      { category: 'histoire-geographie-culture' as Category, attempts: 10, correct: 8, percentage: 80 },
      { category: 'vivre-societe' as Category, attempts: 10, correct: 5, percentage: 50 },
    ]

    const weak = calculateWeakCategories(performance)

    expect(weak).toHaveLength(2)
    // Should be sorted by percentage ascending, limited to 2
    expect(weak[0].category).toBe('vivre-societe')
    expect(weak[1].category).toBe('droits-devoirs')
  })

  it('excludes categories with null percentage', () => {
    const performance = [
      { category: 'principes-valeurs' as Category, attempts: 0, correct: 0, percentage: null },
      { category: 'systeme-institutionnel' as Category, attempts: 10, correct: 5, percentage: 50 },
      { category: 'droits-devoirs' as Category, attempts: 0, correct: 0, percentage: null },
      { category: 'histoire-geographie-culture' as Category, attempts: 0, correct: 0, percentage: null },
      { category: 'vivre-societe' as Category, attempts: 0, correct: 0, percentage: null },
    ]

    const weak = calculateWeakCategories(performance)

    expect(weak).toHaveLength(1)
    expect(weak[0].category).toBe('systeme-institutionnel')
  })

  it('limits results to 2 categories', () => {
    const performance = CATEGORIES.map((cat, i) => ({
      category: cat,
      attempts: 10,
      correct: i,
      percentage: i * 10,
    }))

    const weak = calculateWeakCategories(performance)

    expect(weak).toHaveLength(2)
  })
})

describe('calculateAverageScore', () => {
  it('returns null when no attempts', () => {
    const avg = calculateAverageScore(DEFAULT_CATEGORY_STATS)
    expect(avg).toBeNull()
  })

  it('calculates correct average across all categories', () => {
    const stats: Record<Category, { attempts: number; correct: number }> = {
      'principes-valeurs': { attempts: 10, correct: 8 },
      'systeme-institutionnel': { attempts: 10, correct: 7 },
      'droits-devoirs': { attempts: 10, correct: 9 },
      'histoire-geographie-culture': { attempts: 10, correct: 6 },
      'vivre-societe': { attempts: 10, correct: 10 },
    }

    const avg = calculateAverageScore(stats)
    // Total: 50 attempts, 40 correct = 80%
    expect(avg).toBe(80)
  })

  it('handles uneven attempts across categories', () => {
    const stats: Record<Category, { attempts: number; correct: number }> = {
      'principes-valeurs': { attempts: 20, correct: 18 },
      'systeme-institutionnel': { attempts: 5, correct: 3 },
      'droits-devoirs': { attempts: 0, correct: 0 },
      'histoire-geographie-culture': { attempts: 0, correct: 0 },
      'vivre-societe': { attempts: 0, correct: 0 },
    }

    const avg = calculateAverageScore(stats)
    // Total: 25 attempts, 21 correct = 84%
    expect(avg).toBe(84)
  })

  it('rounds to nearest integer', () => {
    const stats: Record<Category, { attempts: number; correct: number }> = {
      'principes-valeurs': { attempts: 3, correct: 1 },
      'systeme-institutionnel': { attempts: 0, correct: 0 },
      'droits-devoirs': { attempts: 0, correct: 0 },
      'histoire-geographie-culture': { attempts: 0, correct: 0 },
      'vivre-societe': { attempts: 0, correct: 0 },
    }

    const avg = calculateAverageScore(stats)
    // 1/3 = 33.33%, rounds to 33
    expect(avg).toBe(33)
  })
})
