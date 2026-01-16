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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        />
      </svg>
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
