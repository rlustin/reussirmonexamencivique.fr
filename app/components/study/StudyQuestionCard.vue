<script setup lang="ts">
import type { Question } from '~/types'

interface Props {
  question: Question
  highlightedAnswer: number | null
  confirmedAnswer: number | null
  hasAnswered: boolean
  getOptionClass: (index: number) => string
  getLetterClass: (index: number) => string
}

interface Emits {
  (e: 'option-click', index: number): void
  (e: 'confirm'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <div class="card mb-6">
    <!-- Category badges -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
        {{ question.categoryLabel }}
      </span>
      <span
        v-if="question.isSituational"
        class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full"
      >
        {{ $t('study.badges.situational') }}
      </span>
    </div>

    <!-- Question text -->
    <h2 class="text-xl font-medium text-foreground mb-6">
      {{ question.question }}
    </h2>

    <!-- Options -->
    <div class="space-y-3">
      <button
        v-for="(option, optIndex) in question.options"
        :key="optIndex"
        type="button"
        class="w-full text-left p-4 rounded-lg border-2 transition-all"
        :class="getOptionClass(optIndex)"
        :disabled="hasAnswered"
        @click="$emit('option-click', optIndex)"
      >
        <div class="flex items-start gap-3">
          <span
            class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
            :class="getLetterClass(optIndex)"
          >
            {{ String.fromCharCode(65 + optIndex) }}
          </span>
          <span class="flex-1 pt-0.5">{{ option }}</span>
          <!-- Feedback icons -->
          <template v-if="hasAnswered">
            <span v-if="optIndex === question.correctIndex" class="text-success-600">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-else-if="optIndex === confirmedAnswer" class="text-error-600">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </span>
          </template>
        </div>
      </button>
    </div>

    <!-- Keyboard hints (hidden on mobile) -->
    <div v-if="!hasAnswered" class="hidden sm:flex items-center justify-center gap-4 pt-4 text-xs text-gray-400">
      <span>{{ $t('study.keyboard.selectHint') }}</span>
      <span class="text-gray-300">|</span>
      <span>{{ $t('study.keyboard.validateHint') }}</span>
    </div>

    <!-- Validate button -->
    <div v-if="highlightedAnswer !== null && !hasAnswered" class="mt-6 text-center">
      <button
        type="button"
        class="btn btn-primary px-8"
        @click="$emit('confirm')"
      >
        {{ $t('study.quiz.validate') }}
      </button>
    </div>

    <!-- Feedback message -->
    <div v-if="hasAnswered" class="mt-6">
      <div
        v-if="confirmedAnswer === question.correctIndex"
        class="p-4 bg-success-50 border border-success-100 rounded-lg"
      >
        <div class="flex items-center gap-2 text-success-700 font-medium">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ $t('study.quiz.correct') }}
        </div>
      </div>
      <div
        v-else
        class="p-4 bg-error-50 border border-error-100 rounded-lg"
      >
        <div class="flex items-center gap-2 text-error-700 font-medium">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          {{ $t('study.quiz.incorrect') }}
        </div>
      </div>

      <!-- Explanation & Sources -->
      <div v-if="question.explanation" class="mt-4 p-4 bg-info-50 rounded-lg border border-info-100">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm text-info-800">{{ question.explanation }}</p>
            <UiQuestionSources
              v-if="question.sources?.length"
              :sources="question.sources"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
