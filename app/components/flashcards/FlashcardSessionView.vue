<script setup lang="ts">
import type { Question, FlashcardStoredStatus } from '~/types'

interface Props {
  currentDeck: Question[]
  currentCard: Question | null
  currentIndex: number
  isFlipped: boolean
  deckStats: {
    total: number
    known: number
    needsReview: number
    unseen: number
  }
  canGoBack: boolean
  canGoForward: boolean
}

defineProps<Props>()
defineEmits<{
  exit: []
  mark: [status: FlashcardStoredStatus]
  flip: []
  next: []
  previous: []
}>()
</script>

<template>
  <div>
    <!-- Header with progress -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          class="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          @click="$emit('exit')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('flashcards.session.exit') }}
        </button>
        <div class="text-sm text-gray-600" aria-live="polite">
          {{ $t('flashcards.session.progress', { current: currentIndex + 1, total: currentDeck.length }) }}
        </div>
      </div>

      <!-- Deck stats -->
      <div class="flex items-center gap-4 text-sm" aria-live="polite">
        <span class="text-success">{{ $t('flashcards.session.knownCount', { count: deckStats.known }) }}</span>
        <span class="text-error">{{ $t('flashcards.session.needsReviewCount', { count: deckStats.needsReview }) }}</span>
        <span class="text-gray-400">{{ $t('flashcards.session.unseenCount', { count: deckStats.unseen }) }}</span>
      </div>
    </div>

    <!-- Empty deck message -->
    <div v-if="currentDeck.length === 0" class="card text-center py-12">
      <p class="text-gray-600 mb-4">{{ $t('flashcards.empty.message') }}</p>
      <button type="button" class="btn btn-primary" @click="$emit('exit')">
        {{ $t('common.close') }}
      </button>
    </div>

    <!-- Flashcard -->
    <template v-else-if="currentCard">
      <div aria-live="polite" aria-atomic="true">
        <FlashcardsFlashCard
          :question="currentCard"
          :is-flipped="isFlipped"
          class="mb-6"
          @flip="$emit('flip')"
        />
      </div>

      <!-- Controls -->
      <FlashcardsFlashcardControls
        :is-flipped="isFlipped"
        :can-go-back="canGoBack"
        :can-go-forward="canGoForward"
        @mark="$emit('mark', $event)"
        @next="$emit('next')"
        @previous="$emit('previous')"
      />

      <!-- Keyboard hints -->
      <div class="hidden sm:flex items-center justify-center gap-4 mt-6 text-xs text-gray-400">
        <span>{{ $t('flashcards.keyboard.flipHint') }}</span>
        <span class="text-gray-300">|</span>
        <span>{{ $t('flashcards.keyboard.navHint') }}</span>
      </div>
    </template>
  </div>
</template>
