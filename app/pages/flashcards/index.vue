<script setup lang="ts">
import { CATEGORIES } from '~/constants/exam'

const { t } = useI18n()
const { globalStats, getCategoryStats } = useFlashcards()

const {
  isInSession,
  currentDeck,
  currentCard,
  currentIndex,
  isFlipped,
  deckStats,
  canGoBack,
  canGoForward,
  startAllCards,
  startFilteredCards,
  exitSession,
  handleMark,
  flipCard,
  nextCard,
  previousCard,
} = useFlashcardSession()

useSeoMeta({
  title: t('flashcards.meta.title'),
  ogTitle: t('flashcards.meta.title'),
  description: t('flashcards.meta.description'),
  ogDescription: t('flashcards.meta.description'),
  twitterTitle: t('flashcards.meta.title'),
  twitterDescription: t('flashcards.meta.description'),
})
</script>

<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Landing Screen -->
      <template v-if="!isInSession">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">{{ $t('flashcards.header.title') }}</h1>
          <p class="text-gray-600">
            {{ $t('flashcards.header.subtitle') }}
          </p>
        </div>

        <!-- Global Stats -->
        <div class="mb-8">
          <FlashcardsFlashcardStats :stats="globalStats" />
        </div>

        <!-- Start Options -->
        <div class="card mb-6">
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="btn btn-primary px-6"
              :disabled="globalStats.total === 0"
              @click="startAllCards"
            >
              {{ $t('flashcards.start.allCards') }} ({{ globalStats.total }})
            </button>
            <button
              v-if="globalStats.needsReview > 0"
              type="button"
              class="btn bg-error-100 text-error-700 hover:bg-error-200 px-6"
              @click="startFilteredCards('needs-review')"
            >
              {{ $t('flashcards.start.needsReviewOnly') }} ({{ globalStats.needsReview }})
            </button>
            <button
              v-if="globalStats.unseen > 0"
              type="button"
              class="btn btn-secondary px-6"
              @click="startFilteredCards('unseen')"
            >
              {{ $t('flashcards.start.unseenOnly') }} ({{ globalStats.unseen }})
            </button>
          </div>
        </div>

        <!-- Category links -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('study.categories.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="cat in CATEGORIES"
              :key="cat"
              :to="`/flashcards/${cat}`"
              class="p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-50 transition-colors"
            >
              <h3 class="font-medium text-foreground">{{ $t(`categories.full.${cat}`) }}</h3>
              <div class="flex items-center gap-3 mt-1 text-sm">
                <span class="text-gray-500">{{ $t('flashcards.category.questionsCount', { count: getCategoryStats(cat).total }) }}</span>
                <span v-if="getCategoryStats(cat).known > 0" class="text-success">
                  {{ $t('flashcards.session.knownCount', { count: getCategoryStats(cat).known }) }}
                </span>
                <span v-if="getCategoryStats(cat).needsReview > 0" class="text-error">
                  {{ $t('flashcards.session.needsReviewCount', { count: getCategoryStats(cat).needsReview }) }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Related links -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('study.related.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink to="/etudier" class="card hover:shadow-md transition-shadow p-4">
              <h3 class="font-medium text-primary mb-1">{{ $t('nav.study') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('study.header.subtitle', { count: globalStats.total }) }}</p>
            </NuxtLink>
            <NuxtLink to="/quiz" class="card hover:shadow-md transition-shadow p-4">
              <h3 class="font-medium text-primary mb-1">{{ $t('study.related.quiz.title') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('study.related.quiz.description') }}</p>
            </NuxtLink>
          </div>
        </div>
      </template>

      <!-- Session Mode -->
      <FlashcardsFlashcardSessionView
        v-else
        :current-deck="currentDeck"
        :current-card="currentCard"
        :current-index="currentIndex"
        :is-flipped="isFlipped"
        :deck-stats="deckStats"
        :can-go-back="canGoBack"
        :can-go-forward="canGoForward"
        @exit="exitSession"
        @mark="handleMark"
        @flip="flipCard"
        @next="nextCard"
        @previous="previousCard"
      />
    </div>
  </div>
</template>
