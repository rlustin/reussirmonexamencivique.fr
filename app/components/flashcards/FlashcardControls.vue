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
        <IconsXCircle class="w-5 h-5" />
        {{ $t('flashcards.actions.needsReview') }}
      </button>
      <button
        type="button"
        class="btn bg-success-100 text-success-700 hover:bg-success-200 px-6 flex items-center gap-2"
        @click="$emit('mark', 'known')"
      >
        <IconsCheckCircle class="w-5 h-5" />
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
