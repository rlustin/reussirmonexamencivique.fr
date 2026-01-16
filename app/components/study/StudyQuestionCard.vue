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
    <div class="space-y-3" data-testid="answer-options">
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
              <IconsCheckCircle class="w-6 h-6" />
            </span>
            <span v-else-if="optIndex === confirmedAnswer" class="text-error-600">
              <IconsXCircle class="w-6 h-6" />
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
    <div v-if="hasAnswered" class="mt-6" data-testid="answer-feedback">
      <div
        v-if="confirmedAnswer === question.correctIndex"
        class="p-4 bg-success-50 border border-success-100 rounded-lg"
      >
        <div class="flex items-center gap-2 text-success-700 font-medium">
          <IconsCheckCircle class="w-5 h-5" />
          {{ $t('study.quiz.correct') }}
        </div>
      </div>
      <div
        v-else
        class="p-4 bg-error-50 border border-error-100 rounded-lg"
      >
        <div class="flex items-center gap-2 text-error-700 font-medium">
          <IconsXCircle class="w-5 h-5" />
          {{ $t('study.quiz.incorrect') }}
        </div>
      </div>

      <!-- Explanation & Sources -->
      <div v-if="question.explanation" class="mt-4 p-4 bg-info-50 rounded-lg border border-info-100" data-testid="explanation-box">
        <div class="flex items-start gap-2">
          <IconsInfoCircle class="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
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
