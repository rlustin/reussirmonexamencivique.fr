<script setup lang="ts">
interface Props {
  score: number
  total: number
  passed: boolean
  timeSpent: number // in seconds
}

const props = defineProps<Props>()

const percentage = computed(() => Math.round((props.score / props.total) * 100))

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timeSpent / 60)
  const seconds = props.timeSpent % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div class="text-center">
    <!-- Score Circle -->
    <div class="relative inline-flex items-center justify-center mb-8">
      <svg class="w-48 h-48 transform -rotate-90">
        <!-- Background circle -->
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          stroke-width="12"
          fill="none"
          class="text-warm-200"
        />
        <!-- Progress circle -->
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          stroke-width="12"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="553"
          :stroke-dashoffset="553 - (553 * percentage) / 100"
          :class="passed ? 'text-success' : 'text-primary'"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-5xl font-extrabold" :class="passed ? 'text-success' : 'text-primary'">
          {{ score }}
        </span>
        <span class="text-xl text-warm-500 font-medium">/ {{ total }}</span>
      </div>
    </div>

    <!-- Pass/Fail Badge -->
    <div
      class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-lg font-bold mb-8 shadow-soft"
      :class="passed ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-primary-50 text-primary-700 border border-primary-200'"
    >
      <span class="text-2xl" aria-hidden="true">{{ passed ? '🎉' : '😔' }}</span>
      {{ passed ? $t('results.score.passed') : $t('results.score.failed') }}
    </div>

    <!-- Stats -->
    <div class="flex justify-center gap-6 text-warm-600">
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-warm-50">
        <IconsClock class="w-5 h-5 text-secondary" />
        <span class="font-semibold">{{ formattedTime }}</span>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-warm-50">
        <IconsClipboardList class="w-5 h-5 text-info" />
        <span class="font-semibold">{{ percentage }}%</span>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-warm-50">
        <IconsStar class="w-5 h-5 text-accent" />
        <span class="font-semibold">{{ $t('results.score.threshold') }}</span>
      </div>
    </div>
  </div>
</template>
