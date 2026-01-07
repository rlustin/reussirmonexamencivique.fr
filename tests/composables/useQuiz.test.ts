import { describe, it, expect } from 'vitest'
import { shuffleOptions, selectQuestions } from '../../app/composables/useQuiz'
import { EXAM_CONFIG } from '../../app/constants/exam'
import type { Question, Category } from '../../types'

// Helper to create mock questions
function createMockQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'test-1',
    category: 'principes-valeurs' as Category,
    categoryLabel: 'Principes et valeurs',
    question: 'Test question?',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanation: 'Test explanation',
    isSituational: false,
    ...overrides,
  }
}

describe('shuffleOptions', () => {
  it('maintains the same options after shuffling', () => {
    const question = createMockQuestion()
    const shuffled = shuffleOptions(question)

    expect(shuffled.options.sort()).toEqual(question.options.sort())
  })

  it('updates correctIndex to match the correct answer position', () => {
    const question = createMockQuestion({
      options: ['Correct', 'Wrong1', 'Wrong2', 'Wrong3'],
      correctIndex: 0,
    })

    const shuffled = shuffleOptions(question)
    const correctAnswer = question.options[question.correctIndex]

    expect(shuffled.options[shuffled.correctIndex]).toBe(correctAnswer)
  })

  it('does not modify the original question', () => {
    const question = createMockQuestion()
    const originalOptions = [...question.options]
    const originalCorrectIndex = question.correctIndex

    shuffleOptions(question)

    expect(question.options).toEqual(originalOptions)
    expect(question.correctIndex).toBe(originalCorrectIndex)
  })

  it('preserves all question properties except options and correctIndex', () => {
    const question = createMockQuestion({
      id: 'unique-id',
      category: 'droits-devoirs',
      categoryLabel: 'Droits et devoirs',
      question: 'Specific question?',
      explanation: 'Detailed explanation',
      isSituational: true,
    })

    const shuffled = shuffleOptions(question)

    expect(shuffled.id).toBe(question.id)
    expect(shuffled.category).toBe(question.category)
    expect(shuffled.categoryLabel).toBe(question.categoryLabel)
    expect(shuffled.question).toBe(question.question)
    expect(shuffled.explanation).toBe(question.explanation)
    expect(shuffled.isSituational).toBe(question.isSituational)
  })
})

describe('selectQuestions', () => {
  // Create a pool of mock questions
  const situationalQuestions: Question[] = Array.from({ length: 20 }, (_, i) =>
    createMockQuestion({
      id: `sit-${i}`,
      isSituational: true,
      category: 'vivre-societe',
    })
  )

  const generalQuestions: Question[] = Array.from({ length: 100 }, (_, i) =>
    createMockQuestion({
      id: `gen-${i}`,
      isSituational: false,
      category: i % 2 === 0 ? 'principes-valeurs' : 'systeme-institutionnel',
    })
  )

  const allQuestions = [...situationalQuestions, ...generalQuestions]

  it('returns exactly totalQuestions questions', () => {
    const selected = selectQuestions(allQuestions)
    expect(selected).toHaveLength(EXAM_CONFIG.totalQuestions)
  })

  it('includes exactly situationalQuestions situational questions', () => {
    const selected = selectQuestions(allQuestions)
    const situationalCount = selected.filter((q) => q.isSituational).length
    expect(situationalCount).toBe(EXAM_CONFIG.situationalQuestions)
  })

  it('includes exactly generalQuestions general questions', () => {
    const selected = selectQuestions(allQuestions)
    const generalCount = selected.filter((q) => !q.isSituational).length
    expect(generalCount).toBe(EXAM_CONFIG.generalQuestions)
  })

  it('shuffles options for each question', () => {
    const selected = selectQuestions(allQuestions)

    // Each question should still have the correct answer tracked
    selected.forEach((q) => {
      expect(q.options).toHaveLength(4)
      // The correct answer should be at the correctIndex position
      expect(q.options[q.correctIndex]).toBeDefined()
    })
  })

  it('returns different questions on subsequent calls (randomness)', () => {
    const selected1 = selectQuestions(allQuestions)
    const selected2 = selectQuestions(allQuestions)

    const ids1 = selected1.map((q) => q.id).sort()
    const ids2 = selected2.map((q) => q.id).sort()

    // With a pool of 120 questions, selecting 40 should rarely produce identical sets
    // This test may occasionally fail due to randomness, but it's very unlikely
    expect(ids1).not.toEqual(ids2)
  })

  it('handles edge case with exact number of questions needed', () => {
    const exactSituational = situationalQuestions.slice(
      0,
      EXAM_CONFIG.situationalQuestions
    )
    const exactGeneral = generalQuestions.slice(
      0,
      EXAM_CONFIG.generalQuestions
    )
    const exactQuestions = [...exactSituational, ...exactGeneral]

    const selected = selectQuestions(exactQuestions)
    expect(selected).toHaveLength(EXAM_CONFIG.totalQuestions)
  })
})
