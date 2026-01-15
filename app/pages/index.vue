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
  <div class="py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Hero section -->
      <div class="relative text-center mb-12 py-8">
        <div class="blob blob-primary w-64 h-64 -top-20 -left-32 hidden sm:block"/>
        <div class="blob blob-secondary w-48 h-48 -top-10 -right-24 hidden sm:block"/>
        <div class="blob blob-accent w-32 h-32 bottom-0 left-1/4 hidden sm:block"/>

        <div class="relative">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl text-warm-600 max-w-2xl mx-auto leading-relaxed">
            {{ $t('home.hero.subtitle') }}
          </p>

          <div class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-50 text-success-700 text-sm font-medium">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ $t('home.hero.reassurance') }}
          </div>
        </div>
      </div>

      <!-- Progress card (shown only if user has taken quizzes) -->
      <div v-if="hasProgress" class="card mb-8 border-l-4 border-l-primary bg-gradient-to-br from-white to-primary-50/30">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
          <div class="p-1.5 rounded-lg bg-primary-100">
            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          {{ $t('home.progress.title') }}
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div class="text-center p-4 bg-white rounded-xl shadow-soft border border-warm-100">
            <div class="text-2xl font-extrabold text-primary">{{ progress.quizzesTaken }}</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.progress.quizzesTaken') }}</div>
          </div>
          <div class="text-center p-4 bg-white rounded-xl shadow-soft border border-warm-100">
            <div class="text-2xl font-extrabold text-primary">{{ progress.bestScore }}/40</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.progress.bestScore') }}</div>
          </div>
          <div class="text-center p-4 bg-white rounded-xl shadow-soft border border-warm-100">
            <div class="text-2xl font-extrabold" :class="averageScore && averageScore >= 80 ? 'text-success' : 'text-primary'">
              {{ averageScore ?? '-' }}%
            </div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.progress.successRate') }}</div>
          </div>
          <div class="text-center p-4 bg-white rounded-xl shadow-soft border border-warm-100">
            <div class="text-2xl font-extrabold" :class="progress.bestScore >= 32 ? 'text-success' : 'text-error'">
              {{ progress.bestScore >= 32 ? $t('home.progress.yes') : $t('home.progress.no') }}
            </div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.progress.thresholdReached') }}</div>
          </div>
        </div>

        <!-- Weak categories -->
        <div v-if="weakCategories.length > 0" class="pt-4 border-t border-warm-200">
          <p class="text-sm font-semibold text-warm-700 mb-3">{{ $t('home.progress.categoriesToReview') }}</p>
          <div class="space-y-2">
            <div
              v-for="cat in weakCategories"
              :key="cat.category"
              class="flex items-center justify-between text-sm p-2 rounded-lg bg-white/60"
            >
              <span class="text-warm-700">{{ $t(`categories.full.${cat.category}`) }}</span>
              <span class="font-bold px-2 py-0.5 rounded-full text-xs" :class="cat.percentage! < 50 ? 'bg-error-100 text-error-700' : 'bg-warning-100 text-warning-700'">
                {{ cat.percentage }}%
              </span>
            </div>
          </div>
        </div>

        <p v-if="lastQuizFormatted" class="text-xs text-warm-500 mt-4">
          {{ $t('home.progress.lastQuiz', { date: lastQuizFormatted }) }}
        </p>
      </div>

      <!-- Exam info card -->
      <div class="card mb-8" data-testid="exam-info-section">
        <h2 class="text-lg font-bold mb-5 flex items-center gap-2 text-foreground">
          <div class="p-1.5 rounded-lg bg-secondary-100">
            <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          {{ $t('home.examInfo.title') }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-100" data-testid="exam-stat-questions">
            <div class="text-3xl font-extrabold text-primary">40</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.questions') }}</div>
          </div>
          <div class="text-center p-4 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100/50 border border-secondary-100" data-testid="exam-stat-minutes">
            <div class="text-3xl font-extrabold text-secondary-600">45</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.minutes') }}</div>
          </div>
          <div class="text-center p-4 rounded-xl bg-gradient-to-br from-success-50 to-success-100/50 border border-success-100" data-testid="exam-stat-passing">
            <div class="text-3xl font-extrabold text-success">32/40</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.passingScore') }}</div>
          </div>
          <div class="text-center p-4 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 border border-accent-100" data-testid="exam-stat-options">
            <div class="text-3xl font-extrabold text-accent-600">4</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.optionsPerQuestion') }}</div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="card mb-8">
        <h2 class="text-lg font-bold mb-5 flex items-center gap-2 text-foreground">
          <div class="p-1.5 rounded-lg bg-info-100">
            <svg class="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          {{ $t('home.categories.title') }}
        </h2>
        <ul class="space-y-2">
          <NuxtLink
            v-for="(category, index) in categories"
            :key="category.key"
            :to="`/etudier/${category.key}`"
            class="flex justify-between items-center p-3 rounded-xl transition-colors hover:bg-warm-50 group"
            :class="index < categories.length - 1 ? 'border-b border-warm-100' : ''"
          >
            <span class="text-warm-800 font-medium group-hover:text-primary transition-colors">{{ $t(`categories.full.${category.key}`) }}</span>
            <span class="text-sm text-warm-500 bg-warm-100 px-3 py-1 rounded-full">{{ $t('home.categories.questionCount', { count: category.count }) }}</span>
          </NuxtLink>
        </ul>
      </div>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <NuxtLink
          to="/quiz"
          :class="hasQuizInProgress
            ? 'inline-flex items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-600 hover:shadow-soft-lg transition-all text-lg px-8 py-4 w-full sm:w-auto text-center font-bold active:scale-[0.98]'
            : 'btn-primary text-lg px-8 py-4 w-full sm:w-auto text-center shadow-soft hover:shadow-soft-lg'"
        >
          {{ hasQuizInProgress ? $t('home.cta.continue') : $t('home.cta.start') }}
        </NuxtLink>
        <NuxtLink
          v-if="hasQuizInProgress"
          to="/quiz?new=1"
          class="inline-flex items-center justify-center rounded-xl border-2 border-warm-300 text-warm-700 hover:bg-warm-100 transition-all text-lg px-8 py-4 w-full sm:w-auto text-center font-bold active:scale-[0.98]"
        >
          {{ $t('nav.newQuiz') }}
        </NuxtLink>
        <NuxtLink to="/etudier" class="btn-secondary text-lg px-8 py-4 w-full sm:w-auto text-center">
          {{ $t('home.cta.study') }}
        </NuxtLink>
      </div>
      <p class="mt-6 text-sm text-warm-500 text-center">
        {{ $t('home.cta.freeNoSignup') }}
      </p>
    </div>
  </div>
</template>
