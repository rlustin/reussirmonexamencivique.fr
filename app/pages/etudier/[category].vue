<script setup lang="ts">
import type { Category, Question } from '~/types'
import questionsData from '../../../data/questions.json'
import { CATEGORIES } from '~/constants/exam'

const route = useRoute()
const { t } = useI18n()

// Validate category parameter
const categorySlug = computed(() => route.params.category as string)

const isValidCategory = computed(() => {
  return CATEGORIES.includes(categorySlug.value as Category)
})

// Redirect to 404 if invalid category
if (!isValidCategory.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}

const category = computed(() => categorySlug.value as Category)

const allQuestions = questionsData.questions as Question[]

// Filter questions for this category
const categoryQuestions = computed(() => {
  return allQuestions.filter((q) => q.category === category.value)
})

const situationalCount = computed(() => {
  return categoryQuestions.value.filter((q) => q.isSituational).length
})

// Use the study session composable with filtered questions
const {
  isStudying,
  currentIndex,
  highlightedAnswer,
  confirmedAnswer,
  studyQuestions,
  answeredCount,
  correctCount,
  hasAnswered,
  currentQuestion,
  isLastQuestion,
  totalQuestions,
  startStudy,
  handleOptionClick,
  confirmAnswer,
  nextQuestion,
  previousQuestion,
  exitStudy,
  getOptionClass,
  getLetterClass,
} = useStudySession({ questions: categoryQuestions })

// Other categories for navigation
const otherCategories = computed(() => {
  return CATEGORIES.filter((cat) => cat !== category.value)
})

// SEO
useSeoMeta({
  title: t('categoryPage.meta.title', { category: t(`categories.full.${category.value}`) }),
  ogTitle: t('categoryPage.meta.title', { category: t(`categories.full.${category.value}`) }),
  description: t('categoryPage.meta.description', {
    category: t(`categories.full.${category.value}`),
    count: categoryQuestions.value.length,
  }),
  ogDescription: t('categoryPage.meta.description', {
    category: t(`categories.full.${category.value}`),
    count: categoryQuestions.value.length,
  }),
  twitterTitle: t('categoryPage.meta.title', { category: t(`categories.full.${category.value}`) }),
  twitterDescription: t('categoryPage.meta.description', {
    category: t(`categories.full.${category.value}`),
    count: categoryQuestions.value.length,
  }),
  keywords: t('categoryPage.meta.keywords', { category: t(`categories.short.${category.value}`) }),
})
</script>

<template>
  <div class="py-8">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Filter/Setup Screen -->
      <template v-if="!isStudying">
        <!-- Breadcrumb -->
        <nav class="mb-6 text-sm" aria-label="Breadcrumb">
          <ol class="flex items-center gap-2 text-warm-500">
            <li>
              <NuxtLink to="/" class="hover:text-primary">{{ $t('nav.brand') }}</NuxtLink>
            </li>
            <li class="flex items-center gap-2">
              <span>/</span>
              <NuxtLink to="/etudier" class="hover:text-primary">{{ $t('nav.study') }}</NuxtLink>
            </li>
            <li class="flex items-center gap-2">
              <span>/</span>
              <span class="text-foreground font-medium">{{ $t(`categories.short.${category}`) }}</span>
            </li>
          </ol>
        </nav>

        <!-- Bento grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <!-- Category hero tile — spans 2 cols, 2 rows -->
          <div class="bento-tile col-span-2 row-span-2 bg-gradient-to-br from-secondary to-secondary-700 text-white flex flex-col justify-between">
            <div>
              <div class="p-2 rounded-xl bg-white/20 w-fit mb-4">
                <IconsBook class="w-6 h-6" />
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                {{ $t(`categories.full.${category}`) }}
              </h1>
              <p class="text-white/80 text-sm leading-relaxed">
                {{ $t(`categoryPage.descriptions.${category}`) }}
              </p>
            </div>
            <div class="mt-6">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-white text-secondary-700 hover:bg-secondary-50 transition-all px-6 py-3 font-bold active:scale-[0.98] text-center cursor-pointer"
                :disabled="categoryQuestions.length === 0"
                @click="startStudy"
              >
                {{ $t('categoryPage.start') }}
              </button>
            </div>
          </div>

          <!-- Stat: question count -->
          <div class="bento-tile bg-white flex flex-col items-center justify-center text-center">
            <div class="text-3xl sm:text-4xl font-extrabold text-primary">{{ categoryQuestions.length }}</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('home.examInfo.questions') }}</div>
          </div>

          <!-- Stat: situational questions -->
          <div class="bento-tile bg-white flex flex-col items-center justify-center text-center">
            <div class="text-3xl sm:text-4xl font-extrabold text-primary">{{ situationalCount }}</div>
            <div class="text-sm text-warm-600 mt-1">{{ $t('study.badges.situational') }}</div>
          </div>

          <!-- Quiz CTA tile -->
          <NuxtLink
            to="/quiz"
            class="bento-tile col-span-2 bg-gradient-to-br from-primary to-primary-600 text-white flex flex-col justify-between group hover:shadow-soft-lg hover:-translate-y-0.5 transition-all"
          >
            <div class="flex items-start gap-4">
              <div class="p-2 rounded-xl bg-white/20 shrink-0">
                <IconsClipboardList class="w-6 h-6" />
              </div>
              <div>
                <h2 class="font-bold text-lg">{{ $t('categoryPage.startQuiz') }}</h2>
                <p class="text-white/80 text-sm mt-1">{{ $t('home.examInfo.questions') }}: 40 &middot; {{ $t('home.examInfo.minutes') }}: 45</p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Other categories -->
        <h2 class="text-lg font-bold text-foreground mb-4">{{ $t('categoryPage.otherCategories') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NuxtLink
            v-for="cat in otherCategories"
            :key="cat"
            :to="`/etudier/${cat}`"
            class="bento-tile bg-white group hover:shadow-soft-lg hover:-translate-y-0.5 transition-all p-4"
          >
            <h3 class="font-medium text-foreground group-hover:text-primary transition-colors">{{ $t(`categories.full.${cat}`) }}</h3>
            <p class="text-sm text-warm-500 mt-1">
              {{ $t('categoryPage.header.subtitle', { count: allQuestions.filter((q) => q.category === cat).length }) }}
            </p>
          </NuxtLink>
        </div>
      </template>

      <!-- Study Mode -->
      <template v-else>
        <StudyHeader
          :current-index="currentIndex"
          :total-questions="totalQuestions"
          :correct-count="correctCount"
          :answered-count="answeredCount"
          @exit="exitStudy"
        />

        <StudyQuestionCard
          v-if="currentQuestion"
          :question="currentQuestion"
          :highlighted-answer="highlightedAnswer"
          :confirmed-answer="confirmedAnswer"
          :has-answered="hasAnswered"
          :get-option-class="getOptionClass"
          :get-letter-class="getLetterClass"
          @option-click="handleOptionClick"
          @confirm="confirmAnswer"
        />

        <StudyNavigation
          :current-index="currentIndex"
          :total-questions="studyQuestions.length"
          :has-answered="hasAnswered"
          :is-last-question="isLastQuestion"
          @previous="previousQuestion"
          @next="nextQuestion"
          @exit="exitStudy"
        />
      </template>
    </div>
  </div>
</template>
