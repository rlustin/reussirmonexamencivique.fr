<script setup lang="ts">
import type { Category } from '~/types'
import { CATEGORIES } from '~/constants/exam'

definePageMeta({
  validate: (route) => {
    return CATEGORIES.includes(route.params.category as Category)
  },
})

const route = useRoute()
const { t } = useI18n()

const category = computed(() => route.params.category as Category)

const { getCategoryStats } = useFlashcards()

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
} = useFlashcardSession({ category })

const categoryStats = computed(() => getCategoryStats(category.value))

// Other categories for navigation
const otherCategories = computed(() => {
  return CATEGORIES.filter((cat) => cat !== category.value)
})

// SEO
useSeoMeta({
  title: t('flashcards.categoryMeta.title', { category: t(`categories.full.${category.value}`) }),
  ogTitle: t('flashcards.categoryMeta.title', { category: t(`categories.full.${category.value}`) }),
  description: t('flashcards.categoryMeta.description', {
    category: t(`categories.full.${category.value}`),
    count: categoryStats.value.total,
  }),
  ogDescription: t('flashcards.categoryMeta.description', {
    category: t(`categories.full.${category.value}`),
    count: categoryStats.value.total,
  }),
})
</script>

<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Landing Screen -->
      <template v-if="!isInSession">
        <!-- Breadcrumb -->
        <nav class="mb-6 text-sm" aria-label="Breadcrumb">
          <ol class="flex items-center gap-2 text-gray-500">
            <li>
              <NuxtLink to="/" class="hover:text-primary">{{ $t('nav.brand') }}</NuxtLink>
            </li>
            <li class="flex items-center gap-2">
              <span>/</span>
              <NuxtLink to="/flashcards" class="hover:text-primary">{{ $t('flashcards.header.title') }}</NuxtLink>
            </li>
            <li class="flex items-center gap-2">
              <span>/</span>
              <span class="text-foreground font-medium">{{ $t(`categories.short.${category}`) }}</span>
            </li>
          </ol>
        </nav>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">
            {{ $t(`categories.full.${category}`) }}
          </h1>
          <p class="text-gray-600">
            {{ $t('flashcards.categoryHeader.subtitle', { count: categoryStats.total }) }}
          </p>
        </div>

        <!-- Stats -->
        <div class="mb-8">
          <FlashcardsFlashcardStats :stats="categoryStats" />
        </div>

        <!-- Start Options -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('flashcards.start.allCards') }}</h2>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="btn btn-primary px-6"
              :disabled="categoryStats.total === 0"
              @click="startAllCards"
            >
              {{ $t('flashcards.start.allCards') }} ({{ categoryStats.total }})
            </button>
            <button
              v-if="categoryStats.needsReview > 0"
              type="button"
              class="btn bg-error-100 text-error-700 hover:bg-error-200 px-6"
              @click="startFilteredCards('needs-review')"
            >
              {{ $t('flashcards.start.needsReviewOnly') }} ({{ categoryStats.needsReview }})
            </button>
            <button
              v-if="categoryStats.unseen > 0"
              type="button"
              class="btn btn-secondary px-6"
              @click="startFilteredCards('unseen')"
            >
              {{ $t('flashcards.start.unseenOnly') }} ({{ categoryStats.unseen }})
            </button>
          </div>
        </div>

        <!-- Category description -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold mb-3">{{ $t('categoryPage.about.title') }}</h2>
          <p class="text-gray-600">{{ $t(`categoryPage.descriptions.${category}`) }}</p>
        </div>

        <!-- Other categories -->
        <div class="border-t border-gray-200 pt-8">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('categoryPage.otherCategories') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="cat in otherCategories"
              :key="cat"
              :to="`/flashcards/${cat}`"
              class="card hover:shadow-md transition-shadow p-4"
            >
              <h3 class="font-medium text-primary">{{ $t(`categories.full.${cat}`) }}</h3>
              <div class="flex items-center gap-3 mt-1 text-sm">
                <span class="text-gray-500">{{ $t('flashcards.category.questionsCount', { count: getCategoryStats(cat).total }) }}</span>
                <span v-if="getCategoryStats(cat).known > 0" class="text-success">
                  {{ $t('flashcards.session.knownCount', { count: getCategoryStats(cat).known }) }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Related links -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/flashcards" class="btn btn-secondary">
              {{ $t('flashcards.backToAll') }}
            </NuxtLink>
            <NuxtLink :to="`/etudier/${category}`" class="btn btn-primary">
              {{ $t('nav.study') }}
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
