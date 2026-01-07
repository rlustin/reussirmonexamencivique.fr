<script setup lang="ts">
interface Props {
  current: number
  total: number
  answered: number
  answers: (number | null)[]
}

interface Emits {
  (e: 'goTo', index: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()

function getButtonAriaLabel(index: number): string {
  const questionNum = index + 1
  const isAnswered = props.answers[index] !== null
  const isCurrent = index === props.current - 1

  let label = t('a11y.questionNumber', { number: questionNum })
  if (isAnswered) {
    label += ` - ${t('quiz.progress.answered', { count: 1 }, 1)}`
  }
  if (isCurrent) {
    label += ` - ${t('a11y.currentPage')}`
  }
  return label
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium text-foreground" aria-live="polite">
        {{ $t('results.review.question', { number: current }) }} / {{ total }}
      </span>
      <span class="text-gray-500" aria-live="polite">
        {{ $t('quiz.progress.answered', { count: answered }, answered) }}
      </span>
    </div>

    <nav aria-label="Navigation des questions">
      <div class="flex flex-wrap gap-2" role="list">
        <button
          v-for="(answer, index) in answers"
          :key="index"
          type="button"
          role="listitem"
          :aria-label="getButtonAriaLabel(index)"
          :aria-current="index === current - 1 ? 'true' : undefined"
          class="w-9 h-9 sm:w-8 sm:h-8 rounded text-sm sm:text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          :class="[
            index === current - 1
              ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
              : answer !== null
                ? 'bg-primary/20 text-primary hover:bg-primary/30'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          ]"
          @click="$emit('goTo', index)"
        >
          {{ index + 1 }}
        </button>
      </div>
    </nav>
  </div>
</template>
