<script setup lang="ts">
interface Props {
  formattedTime: string
  percentageRemaining: number
  isWarning: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3" role="timer" :aria-label="$t('quiz.timer.remaining')">
    <div class="relative w-10 h-10" aria-hidden="true">
      <svg class="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
        <circle
          class="text-gray-200"
          stroke="currentColor"
          stroke-width="3"
          fill="none"
          cx="18"
          cy="18"
          r="16"
        />
        <circle
          class="transition-all duration-1000"
          :class="isWarning ? 'text-error' : 'text-primary'"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          fill="none"
          cx="18"
          cy="18"
          r="16"
          :stroke-dasharray="`${percentageRemaining}, 100`"
        />
      </svg>
      <div
        class="absolute inset-0 flex items-center justify-center"
        :class="isWarning ? 'text-error' : 'text-gray-600'"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <div>
      <p
        class="text-lg font-mono font-semibold tabular-nums"
        :class="[
          isWarning ? 'text-error animate-pulse' : 'text-foreground',
        ]"
        :aria-live="isWarning ? 'assertive' : 'polite'"
        aria-atomic="true"
      >
        {{ formattedTime }}
      </p>
      <p class="text-xs text-gray-500">{{ $t('quiz.timer.remaining') }}</p>
    </div>
  </div>
</template>
