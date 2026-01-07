export interface TimerOptions {
  duration: number // in seconds
  onTimeout?: () => void
  warningThreshold?: number // in seconds, triggers warning state
}

export function useTimer(options: TimerOptions) {
  const { duration, onTimeout, warningThreshold = 300 } = options

  const remainingTime = ref(duration)
  const isRunning = ref(false)
  const isWarning = ref(false)
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)

  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60)
    const seconds = remainingTime.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const percentageRemaining = computed(() => {
    return (remainingTime.value / duration) * 100
  })

  function start() {
    if (isRunning.value) return

    isRunning.value = true
    intervalId.value = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--
        isWarning.value = remainingTime.value <= warningThreshold
      } else {
        stop()
        onTimeout?.()
      }
    }, 1000)
  }

  function stop() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
    isRunning.value = false
  }

  function reset() {
    stop()
    remainingTime.value = duration
    isWarning.value = false
  }

  function setRemainingTime(seconds: number) {
    remainingTime.value = Math.max(0, Math.min(duration, seconds))
    isWarning.value = remainingTime.value <= warningThreshold
  }

  function getElapsedTime(): number {
    return duration - remainingTime.value
  }

  onUnmounted(() => {
    stop()
  })

  return {
    remainingTime: readonly(remainingTime),
    formattedTime,
    percentageRemaining,
    isRunning: readonly(isRunning),
    isWarning: readonly(isWarning),
    start,
    stop,
    reset,
    setRemainingTime,
    getElapsedTime,
  }
}
