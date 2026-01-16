<script setup lang="ts">
interface Props {
  /**
   * Whether the modal is visible
   */
  show: boolean
}

interface Emits {
  (e: 'confirm'): void
}

defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()
</script>

<template>
  <UiModal
    :show="show"
    role="alertdialog"
    labelled-by="timeout-modal-title"
    described-by="timeout-modal-description"
    :close-on-escape="false"
  >
    <div class="flex items-center gap-3 text-error">
      <IconsClock class="w-8 h-8" aria-hidden="true" />
      <h3 id="timeout-modal-title" class="text-xl font-bold">
        {{ t('quiz.timeoutModal.title') }}
      </h3>
    </div>
    <p id="timeout-modal-description" class="text-gray-600">
      {{ t('quiz.timeoutModal.message') }}
    </p>
    <button
      class="btn btn-primary w-full"
      @click="$emit('confirm')"
    >
      {{ t('quiz.timeoutModal.viewResults') }}
    </button>
  </UiModal>
</template>
