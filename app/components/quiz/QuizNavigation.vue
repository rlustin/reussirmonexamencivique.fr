<script setup lang="ts">
interface Props {
  isFirst: boolean
  isLast: boolean
  canSubmit: boolean
  unansweredCount: number
}

defineProps<Props>()
defineEmits<{
  previous: []
  next: []
  submit: []
}>()
</script>

<template>
  <div class="flex justify-between">
    <button
      type="button"
      class="btn btn-secondary"
      :disabled="isFirst"
      @click="$emit('previous')"
    >
      {{ $t('quiz.navigation.previous') }}
    </button>

    <div v-if="isLast" class="flex flex-col items-center gap-2">
      <button
        type="button"
        class="btn btn-primary"
        @click="$emit('submit')"
      >
        {{ $t('quiz.navigation.finish') }}
      </button>
      <p v-if="unansweredCount > 0" class="text-sm text-amber-600">
        {{ $t('quiz.navigation.unanswered', { count: unansweredCount }, unansweredCount) }}
      </p>
    </div>

    <button
      v-if="!isLast"
      type="button"
      class="btn btn-primary"
      @click="$emit('next')"
    >
      {{ $t('quiz.navigation.next') }}
    </button>
  </div>
</template>
