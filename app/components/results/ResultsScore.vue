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
    <div class="relative inline-flex items-center justify-center mb-6">
      <svg class="w-48 h-48 transform -rotate-90">
        <!-- Background circle -->
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          stroke-width="12"
          fill="none"
          class="text-gray-200"
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
          :class="passed ? 'text-success' : 'text-error'"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-5xl font-bold" :class="passed ? 'text-success' : 'text-error'">
          {{ score }}
        </span>
        <span class="text-xl text-gray-500">/ {{ total }}</span>
      </div>
    </div>

    <!-- Pass/Fail Badge -->
    <div
      class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold mb-6"
      :class="passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
    >
      <svg
        v-if="passed"
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      {{ passed ? $t('results.score.passed') : $t('results.score.failed') }}
    </div>

    <!-- Stats -->
    <div class="flex justify-center gap-8 text-gray-600">
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ formattedTime }}</span>
      </div>
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
          />
          <path
            fill-rule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ percentage }}%</span>
      </div>
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        <span>{{ $t('results.score.threshold') }}</span>
      </div>
    </div>
  </div>
</template>
