import { describe, it, expect } from 'vitest'
import { shuffle } from '../../app/utils/shuffle'

describe('shuffle', () => {
  it('returns an array with the same length', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
  })

  it('returns an array containing the same elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result.sort()).toEqual(input.sort())
  })

  it('does not modify the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const inputCopy = [...input]
    shuffle(input)
    expect(input).toEqual(inputCopy)
  })

  it('works with an empty array', () => {
    const result = shuffle([])
    expect(result).toEqual([])
  })

  it('works with a single element', () => {
    const result = shuffle([1])
    expect(result).toEqual([1])
  })

  it('works with strings', () => {
    const input = ['a', 'b', 'c', 'd']
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
    expect(result.sort()).toEqual(input.sort())
  })

  it('works with objects', () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
    // Check that all original objects are present (by reference)
    input.forEach((item) => {
      expect(result).toContain(item)
    })
  })

  it('actually shuffles the array (statistical test)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let differentOrderCount = 0
    const iterations = 100

    for (let i = 0; i < iterations; i++) {
      const result = shuffle(input)
      // Check if the order is different from the original
      const isDifferent = result.some((val, idx) => val !== input[idx])
      if (isDifferent) {
        differentOrderCount++
      }
    }

    // With 10 elements, the probability of getting the exact same order is 1/10! (very low)
    // We expect most iterations to produce a different order
    expect(differentOrderCount).toBeGreaterThan(iterations * 0.9)
  })
})
