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
            <IconsCheckCircle v-if="answer.isCorrect" class="w-5 h-5 text-success" />
            <IconsXCircle v-else class="w-5 h-5 text-error" />
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
          <IconsChevronDown
            class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
            :class="{ 'rotate-180': isExpanded(index) }"
          />
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
              <IconsCheck
                v-if="optIndex === answer.question.correctIndex"
                class="w-5 h-5 text-success-600 flex-shrink-0"
              />
              <IconsX
                v-else-if="optIndex === answer.userAnswer && !answer.isCorrect"
                class="w-5 h-5 text-error-600 flex-shrink-0"
              />
            </div>
          </div>

          <!-- No answer warning -->
          <div
            v-if="answer.userAnswer === null"
            class="flex items-center gap-2 text-warning-600 text-sm mb-4"
          >
            <IconsWarning class="w-4 h-4" />
            <span>{{ $t('results.review.noAnswer') }}</span>
          </div>

          <!-- Explanation -->
          <div
            v-if="answer.question.explanation"
            class="bg-info-50 border border-info-200 rounded-lg p-4"
          >
            <div class="flex items-start gap-2">
              <IconsInfoCircle class="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
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
