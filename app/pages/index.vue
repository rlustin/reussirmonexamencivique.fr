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
    <div class="max-w-5xl mx-auto px-4">
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
            <IconsCheckCircle class="w-4 h-4" />
            {{ $t('home.hero.reassurance') }}
          </div>
        </div>
      </div>

      <!-- Bento grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="exam-info-section">

        <!-- CTA tile — spans 2 cols, prominent -->
        <div class="bento-tile col-span-2 row-span-2 bg-gradient-to-br from-primary to-primary-600 text-white flex flex-col justify-between">
          <div>
            <div class="p-2 rounded-xl bg-white/20 w-fit mb-4">
              <IconsClipboardList class="w-6 h-6" />
            </div>
            <h2 class="text-2xl font-extrabold leading-tight mb-2">
              {{ hasQuizInProgress ? $t('home.cta.continue') : $t('home.cta.start') }}
            </h2>
            <p class="text-white/80 text-sm leading-relaxed">
              {{ $t('home.cta.freeNoSignup') }}
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <NuxtLink
              to="/quiz"
              class="inline-flex items-center justify-center rounded-xl bg-white text-primary-700 hover:bg-primary-50 transition-all px-6 py-3 font-bold active:scale-[0.98] text-center"
            >
              {{ hasQuizInProgress ? $t('home.cta.continue') : $t('home.cta.start') }}
            </NuxtLink>
            <NuxtLink
              v-if="hasQuizInProgress"
              to="/quiz?new=1"
              class="inline-flex items-center justify-center rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-all px-6 py-3 font-bold active:scale-[0.98] text-center"
            >
              {{ $t('nav.newQuiz') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Exam stat tiles -->
        <div class="bento-tile bg-white flex flex-col items-center justify-center text-center" data-testid="exam-stat-questions">
          <div class="text-3xl sm:text-4xl font-extrabold text-primary">40</div>
          <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.questions') }}</div>
        </div>
        <div class="bento-tile bg-white flex flex-col items-center justify-center text-center" data-testid="exam-stat-minutes">
          <div class="text-3xl sm:text-4xl font-extrabold text-primary">45</div>
          <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.minutes') }}</div>
        </div>
        <div class="bento-tile bg-white flex flex-col items-center justify-center text-center" data-testid="exam-stat-passing">
          <div class="text-3xl sm:text-4xl font-extrabold text-primary">32/40</div>
          <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.passingScore') }}</div>
        </div>
        <div class="bento-tile bg-white flex flex-col items-center justify-center text-center" data-testid="exam-stat-options">
          <div class="text-3xl sm:text-4xl font-extrabold text-primary">4</div>
          <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.optionsPerQuestion') }}</div>
        </div>

        <!-- Study tile — spans 2 cols -->
        <div class="bento-tile col-span-2 bg-gradient-to-br from-secondary to-secondary-700 text-white flex flex-col justify-between">
          <div>
            <div class="p-2 rounded-xl bg-white/20 w-fit mb-4">
              <IconsBook class="w-6 h-6" />
            </div>
            <h3 class="text-2xl font-extrabold leading-tight mb-2">{{ $t('home.cta.study') }}</h3>
            <p class="text-white/80 text-sm leading-relaxed">{{ $t('home.categories.title') }}</p>
          </div>
          <div class="mt-6">
            <NuxtLink
              to="/etudier"
              class="inline-flex items-center justify-center rounded-xl bg-white text-secondary-700 hover:bg-secondary-50 transition-all px-6 py-3 font-bold active:scale-[0.98] text-center"
            >
              {{ $t('home.cta.study') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Categories list tile — spans 2 cols -->
        <div class="bento-tile col-span-2 bg-white">
          <h3 class="font-bold text-foreground mb-3 flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-secondary-100">
              <IconsArchive class="w-4 h-4 text-secondary-600" />
            </div>
            {{ $t('home.categories.title') }}
          </h3>
          <ul class="space-y-1">
            <NuxtLink
              v-for="category in categories"
              :key="category.key"
              :to="`/etudier/${category.key}`"
              class="flex justify-between items-center p-2.5 rounded-lg transition-colors hover:bg-warm-50 group"
            >
              <span class="text-sm text-warm-800 font-medium group-hover:text-primary transition-colors">{{ $t(`categories.full.${category.key}`) }}</span>
              <span class="text-xs text-warm-500 bg-warm-100 px-2.5 py-0.5 rounded-full">{{ category.count }}</span>
            </NuxtLink>
          </ul>
        </div>
      </div>

      <!-- Progress card (shown only if user has taken quizzes) -->
      <div v-if="hasProgress" class="bento-tile bg-gradient-to-br from-white to-primary-50/30 border-l-4 border-l-primary mb-8">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
          <div class="p-1.5 rounded-lg bg-primary-100">
            <IconsCheckCircle class="w-5 h-5 text-primary" />
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
              <span class="font-bold px-2 py-0.5 rounded-full text-xs" :class="cat.percentage! < 50 ? 'bg-error-100 text-error-700' : 'bg-primary-100 text-primary-700'">
                {{ cat.percentage }}%
              </span>
            </div>
          </div>
        </div>

        <p v-if="lastQuizFormatted" class="text-xs text-warm-500 mt-4">
          {{ $t('home.progress.lastQuiz', { date: lastQuizFormatted }) }}
        </p>
      </div>
    </div>
  </div>
</template>
