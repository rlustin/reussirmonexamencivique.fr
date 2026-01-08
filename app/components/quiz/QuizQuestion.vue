<script setup lang="ts">
import type { Question } from '~/types'

interface Props {
  question: Question
  selectedAnswer: number | null
  questionNumber?: number
}

interface Emits {
  (e: 'select', answerIndex: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()

const optionLabels = ['A', 'B', 'C', 'D']

// Generate unique ID for this question group
const questionId = computed(() => `question-${props.question.id}`)
</script>

<template>
  <div class="space-y-6" role="group" :aria-labelledby="questionId">
    <div class="space-y-3">
      <CategoryBadge :category="question.category" />
      <h2
        :id="questionId"
        class="text-xl font-semibold text-foreground leading-relaxed"
      >
        {{ question.question }}
      </h2>
    </div>

    <div class="space-y-3" role="radiogroup" :aria-labelledby="questionId">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        type="button"
        role="radio"
        :aria-checked="selectedAnswer === index"
        :aria-label="`${optionLabels[index]}. ${option}${selectedAnswer === index ? ` - ${t('a11y.selected')}` : ''}`"
        class="w-full text-left p-4 rounded-lg border-2 transition-all duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        :class="[
          selectedAnswer === index
            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
        ]"
        @click="$emit('select', index)"
      >
        <div class="flex items-start gap-3">
          <span
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
            :class="[
              selectedAnswer === index
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600',
            ]"
            aria-hidden="true"
          >
            {{ optionLabels[index] }}
          </span>
          <span class="pt-1 text-foreground flex-1">{{ option }}</span>
        </div>
      </button>
    </div>

    <!-- Keyboard hints footer (hidden on mobile) -->
    <div class="hidden sm:flex items-center justify-center gap-4 pt-2 text-xs text-gray-400">
      <span>{{ $t('quiz.keyboard.selectHint') }}</span>
      <span class="text-gray-300">|</span>
      <span>{{ $t('quiz.keyboard.navHint') }}</span>
    </div>
  </div>
</template>
