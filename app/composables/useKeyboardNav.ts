import type { MaybeRef } from 'vue'

export interface KeyboardNavOptions {
  /** Callback when user selects an answer (up/down arrows) */
  onSelectAnswer?: (index: number) => void
  /** Callback when user presses right arrow or Enter */
  onNext?: () => void
  /** Callback when user presses left arrow */
  onPrevious?: () => void
  /** Whether keyboard navigation is enabled (reactive) */
  enabled?: MaybeRef<boolean>
  /** Number of answer options (default: 4) */
  optionsCount?: number
  /** Current selected answer index (reactive, for up/down navigation) */
  currentAnswer?: MaybeRef<number | null>
}

/**
 * Composable for keyboard navigation in quiz/study mode
 * Supports:
 * - Up/Down arrows to cycle through answers
 * - Left/Right arrows for question navigation
 * - Enter for next question
 */
export function useKeyboardNav(options: KeyboardNavOptions) {
  const {
    onSelectAnswer,
    onNext,
    onPrevious,
    enabled = true,
    optionsCount = 4,
    currentAnswer = null,
  } = options

  const isEnabled = computed(() => toValue(enabled))

  function handleKeydown(event: KeyboardEvent) {
    if (!isEnabled.value) return

    // Don't handle if user is typing in an input field
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      return
    }

    // Answer selection: Up/Down arrows to cycle through answers
    if (onSelectAnswer) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        const current = toValue(currentAnswer)
        const nextIndex = current === null ? 0 : (current + 1) % optionsCount
        onSelectAnswer(nextIndex)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const current = toValue(currentAnswer)
        const prevIndex = current === null ? optionsCount - 1 : (current - 1 + optionsCount) % optionsCount
        onSelectAnswer(prevIndex)
        return
      }
    }

    // Question navigation: Left/Right arrow keys
    if (event.key === 'ArrowRight') {
      if (onNext) {
        event.preventDefault()
        onNext()
        return
      }
    }

    if (event.key === 'ArrowLeft') {
      if (onPrevious) {
        event.preventDefault()
        onPrevious()
        return
      }
    }

    // Enter: go to next
    if (event.key === 'Enter') {
      if (onNext) {
        event.preventDefault()
        onNext()
        return
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    isEnabled,
  }
}
