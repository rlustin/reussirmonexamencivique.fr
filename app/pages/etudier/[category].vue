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
    <div class="max-w-4xl mx-auto px-4">
      <!-- Filter/Setup Screen -->
      <template v-if="!isStudying">
        <!-- Breadcrumb -->
        <nav class="mb-6 text-sm" aria-label="Breadcrumb">
          <ol class="flex items-center gap-2 text-gray-500">
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

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">
            {{ $t(`categories.full.${category}`) }}
          </h1>
          <p class="text-gray-600">
            {{ $t('categoryPage.header.subtitle', { count: categoryQuestions.length }) }}
          </p>
          <div v-if="situationalCount > 0" class="mt-2 text-sm text-gray-500">
            {{ $t('categoryPage.header.situational', { count: situationalCount }, situationalCount) }}
          </div>
        </div>

        <!-- Category description -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold mb-3">{{ $t('categoryPage.about.title') }}</h2>
          <p class="text-gray-600">{{ $t(`categoryPage.descriptions.${category}`) }}</p>
        </div>

        <!-- Start button -->
        <div class="text-center mb-12">
          <button
            type="button"
            class="btn btn-primary px-8 py-3 text-lg"
            :disabled="categoryQuestions.length === 0"
            @click="startStudy"
          >
            {{ $t('categoryPage.start') }}
          </button>
        </div>

        <!-- Other categories -->
        <div class="border-t border-gray-200 pt-8">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('categoryPage.otherCategories') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="cat in otherCategories"
              :key="cat"
              :to="`/etudier/${cat}`"
              class="card hover:shadow-md transition-shadow p-4"
            >
              <h3 class="font-medium text-primary">{{ $t(`categories.full.${cat}`) }}</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ allQuestions.filter((q) => q.category === cat).length }} questions
              </p>
            </NuxtLink>
          </div>
        </div>

        <!-- Related links -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/etudier" class="btn btn-secondary">
              {{ $t('categoryPage.backToStudy') }}
            </NuxtLink>
            <NuxtLink to="/quiz" class="btn btn-primary">
              {{ $t('categoryPage.startQuiz') }}
            </NuxtLink>
          </div>
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
