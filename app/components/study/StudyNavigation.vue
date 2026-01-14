<script setup lang="ts">
interface Props {
  currentIndex: number
  totalQuestions: number
  hasAnswered: boolean
  isLastQuestion: boolean
}

interface Emits {
  (e: 'previous' | 'next' | 'exit'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="flex justify-between">
    <button
      type="button"
      class="btn btn-secondary"
      :disabled="currentIndex === 0"
      @click="$emit('previous')"
    >
      {{ $t('study.quiz.previous') }}
    </button>

    <button
      v-if="hasAnswered && !isLastQuestion"
      type="button"
      class="btn btn-primary"
      @click="$emit('next')"
    >
      {{ $t('study.quiz.next') }}
    </button>

    <button
      v-else-if="hasAnswered && isLastQuestion"
      type="button"
      class="btn btn-primary"
      @click="$emit('exit')"
    >
      {{ $t('study.quiz.finish') }}
    </button>

    <div v-else class="w-24" />
  </div>
</template>
