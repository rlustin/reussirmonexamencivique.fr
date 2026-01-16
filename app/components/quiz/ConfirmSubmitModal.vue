<script setup lang="ts">
interface Props {
  /**
   * Whether the modal is visible
   */
  show: boolean
  /**
   * Number of unanswered questions
   */
  unansweredCount: number
}

interface Emits {
  (e: 'confirm' | 'cancel'): void
}

defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()
</script>

<template>
  <UiModal
    :show="show"
    role="dialog"
    labelled-by="confirm-modal-title"
    @close="$emit('cancel')"
  >
    <h3 id="confirm-modal-title" class="text-xl font-bold text-foreground">
      {{ t('quiz.confirmModal.title') }}
    </h3>
    <p class="text-gray-600">
      {{ t('quiz.confirmModal.message', { count: unansweredCount }) }}
    </p>
    <div class="flex gap-3 pt-2">
      <button
        class="btn btn-secondary flex-1"
        @click="$emit('cancel')"
      >
        {{ t('quiz.confirmModal.continue') }}
      </button>
      <button
        class="btn btn-primary flex-1"
        @click="$emit('confirm')"
      >
        {{ t('quiz.confirmModal.finish') }}
      </button>
    </div>
  </UiModal>
</template>
