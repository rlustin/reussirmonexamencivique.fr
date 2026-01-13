<script setup lang="ts">
import type { Question } from '~/types'

interface Props {
  question: Question
  isFlipped: boolean
}

defineProps<Props>()
defineEmits<{
  flip: []
}>()
</script>

<template>
  <div
    class="flashcard-container cursor-pointer"
    @click="$emit('flip')"
  >
    <!-- Note: duration-500 (500ms) must match FLIP_ANIMATION_DURATION_MS in useFlashcards.ts -->
    <div
      class="flashcard relative w-full min-h-80 transition-transform duration-500"
      :class="{ 'is-flipped': isFlipped }"
    >
      <!-- Front (Question) -->
      <div class="flashcard-face flashcard-front absolute inset-0 bg-white rounded-2xl shadow-soft border border-warm-200 p-6 flex flex-col">
        <div class="flex-shrink-0 mb-4">
          <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
            {{ question.categoryLabel }}
          </span>
          <span v-if="question.isSituational" class="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
            {{ $t('study.badges.situational') }}
          </span>
        </div>
        <div class="flex-1 flex items-center justify-center">
          <p class="text-xl font-medium text-foreground text-center">
            {{ question.question }}
          </p>
        </div>
        <div class="flex-shrink-0 text-center text-sm text-gray-400">
          {{ $t('flashcards.card.tapToFlip') }}
        </div>
      </div>

      <!-- Back (Answer) -->
      <div class="flashcard-face flashcard-back absolute inset-0 bg-gradient-to-br from-success-50 to-white rounded-2xl shadow-soft border border-success-200 p-6 flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-success-700 mb-3">
            {{ $t('flashcards.card.answer') }}
          </h3>
          <p class="text-lg text-foreground">
            {{ question.options[question.correctIndex] }}
          </p>
        </div>
        <div class="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-400">
          {{ $t('flashcards.card.tapToFlip') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flashcard-container {
  perspective: 1000px;
}

.flashcard {
  transform-style: preserve-3d;
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flashcard-back {
  transform: rotateY(180deg);
}
</style>
