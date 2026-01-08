<script setup lang="ts">
import type { Category } from '~/types'
import { useProgress } from '~/composables/useProgress'

const { t } = useI18n()
const { progress, hasProgress, lastQuizFormatted, weakCategories, averageScore } = useProgress()
const { quizState } = useQuiz()

// Check if a quiz is in progress (not finished)
const hasQuizInProgress = computed(() => {
  return quizState.value && !quizState.value.isFinished
})

useSeoMeta({
  title: t('home.meta.title'),
  ogTitle: t('meta.ogTitle'),
  description: t('home.meta.description'),
  ogDescription: t('meta.ogDescription'),
  author: t('meta.author'),
  keywords: t('meta.keywords'),
  twitterTitle: t('meta.ogTitle'),
  twitterDescription: t('meta.ogDescription'),
})

const categories: { key: Category; count: number }[] = [
  { key: 'principes-valeurs', count: 38 },
  { key: 'systeme-institutionnel', count: 56 },
  { key: 'droits-devoirs', count: 38 },
  { key: 'histoire-geographie-culture', count: 83 },
  { key: 'vivre-societe', count: 44 },
]
</script>

<template>
  <div class="py-12">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Hero section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-foreground mb-4">
          {{ $t('home.hero.title') }}
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          {{ $t('home.hero.subtitle') }}
        </p>
      </div>

      <!-- Progress card (shown only if user has taken quizzes) -->
      <div v-if="hasProgress" class="card mb-8 border-l-4 border-l-primary">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ $t('home.progress.title') }}
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary">{{ progress.quizzesTaken }}</div>
            <div class="text-sm text-gray-600">{{ $t('home.progress.quizzesTaken') }}</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary">{{ progress.bestScore }}/40</div>
            <div class="text-sm text-gray-600">{{ $t('home.progress.bestScore') }}</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold" :class="averageScore && averageScore >= 80 ? 'text-success' : 'text-primary'">
              {{ averageScore ?? '-' }}%
            </div>
            <div class="text-sm text-gray-600">{{ $t('home.progress.successRate') }}</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold" :class="progress.bestScore >= 32 ? 'text-success' : 'text-error'">
              {{ progress.bestScore >= 32 ? $t('home.progress.yes') : $t('home.progress.no') }}
            </div>
            <div class="text-sm text-gray-600">{{ $t('home.progress.thresholdReached') }}</div>
          </div>
        </div>

        <!-- Weak categories -->
        <div v-if="weakCategories.length > 0" class="pt-4 border-t border-gray-100">
          <p class="text-sm font-medium text-gray-700 mb-2">{{ $t('home.progress.categoriesToReview') }}</p>
          <div class="space-y-2">
            <div
              v-for="cat in weakCategories"
              :key="cat.category"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-600">{{ $t(`categories.full.${cat.category}`) }}</span>
              <span class="font-medium" :class="cat.percentage! < 50 ? 'text-error' : 'text-warning-600'">
                {{ cat.percentage }}%
              </span>
            </div>
          </div>
        </div>

        <p v-if="lastQuizFormatted" class="text-xs text-gray-500 mt-4">
          {{ $t('home.progress.lastQuiz', { date: lastQuizFormatted }) }}
        </p>
      </div>

      <!-- Exam info card -->
      <div class="card mb-8">
        <h2 class="text-lg font-semibold mb-4">{{ $t('home.examInfo.title') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-3xl font-bold text-primary">40</div>
            <div class="text-sm text-gray-600">{{ $t('home.examInfo.questions') }}</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary">45</div>
            <div class="text-sm text-gray-600">{{ $t('home.examInfo.minutes') }}</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary">32/40</div>
            <div class="text-sm text-gray-600">{{ $t('home.examInfo.passingScore') }}</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary">4</div>
            <div class="text-sm text-gray-600">{{ $t('home.examInfo.optionsPerQuestion') }}</div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="card mb-8">
        <h2 class="text-lg font-semibold mb-4">{{ $t('home.categories.title') }}</h2>
        <ul class="space-y-3">
          <li
            v-for="category in categories"
            :key="category.key"
            class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
          >
            <span class="text-gray-700">{{ $t(`categories.full.${category.key}`) }}</span>
            <span class="text-sm text-gray-500">{{ $t('home.categories.questionCount', { count: category.count }) }}</span>
          </li>
        </ul>
      </div>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <NuxtLink
          to="/quiz"
          :class="hasQuizInProgress
            ? 'inline-flex items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-600 transition-colors text-lg px-8 py-3 w-full sm:w-auto text-center font-medium'
            : 'btn-primary text-lg px-8 py-3 w-full sm:w-auto text-center'"
        >
          {{ hasQuizInProgress ? $t('home.cta.continue') : $t('home.cta.start') }}
        </NuxtLink>
        <NuxtLink
          v-if="hasQuizInProgress"
          to="/quiz?new=1"
          class="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-lg px-8 py-3 w-full sm:w-auto text-center font-medium"
        >
          {{ $t('nav.newQuiz') }}
        </NuxtLink>
        <NuxtLink to="/etudier" class="btn-secondary text-lg px-8 py-3 w-full sm:w-auto text-center">
          {{ $t('home.cta.study') }}
        </NuxtLink>
      </div>
      <p class="mt-4 text-sm text-gray-500 text-center">
        {{ $t('home.cta.freeNoSignup') }}
      </p>
    </div>
  </div>
</template>
