<script setup lang="ts">
interface Props {
  currentIndex: number
  totalQuestions: number
  correctCount: number
  answeredCount: number
}

interface Emits {
  (e: 'exit'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        class="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        @click="$emit('exit')"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('study.quiz.exit') }}
      </button>
      <div class="text-sm text-gray-600">
        {{ $t('study.quiz.score', { correct: correctCount, answered: answeredCount }) }}
      </div>
    </div>

    <div class="text-sm text-gray-600">
      {{ $t('study.quiz.progress', { current: currentIndex + 1, total: totalQuestions }) }}
    </div>
  </div>
</template>
