<script setup lang="ts">
import type { FlashcardStoredStatus } from '~/types'

interface Props {
  isFlipped: boolean
  canGoBack: boolean
  canGoForward: boolean
}

defineProps<Props>()
defineEmits<{
  mark: [status: FlashcardStoredStatus]
  next: []
  previous: []
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Marking buttons (shown when flipped) -->
    <div v-if="isFlipped" class="flex gap-3 justify-center">
      <button
        type="button"
        class="btn bg-error-100 text-error-700 hover:bg-error-200 px-6 flex items-center gap-2"
        @click="$emit('mark', 'needs-review')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        {{ $t('flashcards.actions.needsReview') }}
      </button>
      <button
        type="button"
        class="btn bg-success-100 text-success-700 hover:bg-success-200 px-6 flex items-center gap-2"
        @click="$emit('mark', 'known')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        {{ $t('flashcards.actions.known') }}
      </button>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between items-center">
      <button
        type="button"
        class="btn btn-secondary"
        :disabled="!canGoBack"
        @click="$emit('previous')"
      >
        {{ $t('flashcards.actions.previous') }}
      </button>

      <button
        type="button"
        class="btn btn-primary"
        :disabled="!canGoForward"
        @click="$emit('next')"
      >
        {{ $t('flashcards.actions.next') }}
      </button>
    </div>
  </div>
</template>
