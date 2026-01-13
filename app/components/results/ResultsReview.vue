<script setup lang="ts">
import type { Question } from '~/types'

interface AnswerDetail {
  question: Question
  userAnswer: number | null
  isCorrect: boolean
}

interface Props {
  answers: AnswerDetail[]
}

defineProps<Props>()

const expandedQuestions = ref<Set<number>>(new Set())

function toggleQuestion(index: number) {
  if (expandedQuestions.value.has(index)) {
    expandedQuestions.value.delete(index)
  } else {
    expandedQuestions.value.add(index)
  }
}

function isExpanded(index: number): boolean {
  return expandedQuestions.value.has(index)
}

function expandAll() {
  for (let i = 0; i < 40; i++) {
    expandedQuestions.value.add(i)
  }
}

function collapseAll() {
  expandedQuestions.value.clear()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-foreground">
        {{ $t('results.review.title') }}
      </h3>
      <div class="flex gap-2">
        <button
          type="button"
          class="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          @click="expandAll"
        >
          {{ $t('results.review.expandAll') }}
        </button>
        <span class="text-gray-300" aria-hidden="true">|</span>
        <button
          type="button"
          class="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          @click="collapseAll"
        >
          {{ $t('results.review.collapseAll') }}
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="(answer, index) in answers"
        :key="index"
        class="border rounded-lg overflow-hidden"
        :class="answer.isCorrect ? 'border-success-100 bg-success-50/50' : 'border-error-100 bg-error-50/50'"
      >
        <!-- Question header (always visible) -->
        <button
          type="button"
          class="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          :aria-expanded="isExpanded(index)"
          :aria-controls="`review-answer-${index}`"
          @click="toggleQuestion(index)"
        >
          <!-- Status icon -->
          <div class="flex-shrink-0 mt-0.5" aria-hidden="true">
            <svg
              v-if="answer.isCorrect"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-success"
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
              class="w-5 h-5 text-error"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <!-- Question number and text -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-medium text-gray-500">
                {{ $t('results.review.question', { number: index + 1 }) }}
              </span>
              <CategoryBadge :category="answer.question.category" />
            </div>
            <p class="text-foreground font-medium line-clamp-2">
              {{ answer.question.question }}
            </p>
          </div>

          <!-- Expand/collapse icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
            :class="{ 'rotate-180': isExpanded(index) }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <!-- Expanded content -->
        <div
          v-if="isExpanded(index)"
          :id="`review-answer-${index}`"
          class="px-4 pb-4 pt-2 border-t"
          :class="answer.isCorrect ? 'border-success-100' : 'border-error-100'"
        >
          <!-- Answer options -->
          <div class="space-y-2 mb-4">
            <div
              v-for="(option, optIndex) in answer.question.options"
              :key="optIndex"
              class="flex items-start gap-3 p-3 rounded-lg"
              :class="{
                'bg-success-100 border border-success': optIndex === answer.question.correctIndex,
                'bg-error-100 border border-error': optIndex === answer.userAnswer && !answer.isCorrect,
                'bg-white border border-gray-200': optIndex !== answer.question.correctIndex && optIndex !== answer.userAnswer,
              }"
            >
              <!-- Option letter -->
              <span
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
                :class="{
                  'bg-success text-white': optIndex === answer.question.correctIndex,
                  'bg-error text-white': optIndex === answer.userAnswer && !answer.isCorrect,
                  'bg-gray-200 text-gray-600': optIndex !== answer.question.correctIndex && optIndex !== answer.userAnswer,
                }"
              >
                {{ String.fromCharCode(65 + optIndex) }}
              </span>

              <!-- Option text -->
              <span class="flex-1" :class="{ 'font-medium': optIndex === answer.question.correctIndex || optIndex === answer.userAnswer }">
                {{ option }}
              </span>

              <!-- Indicator icons -->
              <svg
                v-if="optIndex === answer.question.correctIndex"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-success-600 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else-if="optIndex === answer.userAnswer && !answer.isCorrect"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-error-600 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- No answer warning -->
          <div
            v-if="answer.userAnswer === null"
            class="flex items-center gap-2 text-warning-600 text-sm mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ $t('results.review.noAnswer') }}</span>
          </div>

          <!-- Explanation -->
          <div
            v-if="answer.question.explanation"
            class="bg-info-50 border border-info-200 rounded-lg p-4"
          >
            <div class="flex items-start gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <p class="text-sm font-medium text-info-800 mb-1">{{ $t('results.review.explanation') }}</p>
                <p class="text-sm text-info-700">{{ answer.question.explanation }}</p>
                <UiQuestionSources
                  v-if="answer.question.sources?.length"
                  :sources="answer.question.sources"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
