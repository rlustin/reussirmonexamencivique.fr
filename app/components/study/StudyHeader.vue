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
        data-testid="exit-study-button"
        class="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        @click="$emit('exit')"
      >
        <IconsArrowLeft class="w-5 h-5" />
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
