<script setup lang="ts">
import type { Question } from '~/types'
import questionsData from '../../data/questions.json'
import { CATEGORIES } from '~/constants/exam'

definePageMeta({
  path: '/etudier',
})

const { t } = useI18n()

const allQuestions = questionsData.questions as Question[]

// Create a computed ref for the composable
const filteredQuestions = computed(() => allQuestions)

// Use the study session composable
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
} = useStudySession({ questions: filteredQuestions })

// Category counts for links to category pages
const categoryCount = computed(() => {
  const counts: Record<string, number> = {}
  for (const cat of CATEGORIES) {
    counts[cat] = allQuestions.filter((q) => q.category === cat).length
  }
  return counts
})

useSeoMeta({
  title: t('study.meta.title'),
  ogTitle: t('study.meta.title'),
  description: t('study.meta.description'),
  ogDescription: t('study.meta.description'),
  twitterTitle: t('study.meta.title'),
  twitterDescription: t('study.meta.description'),
  keywords: t('study.meta.keywords'),
})
</script>

<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Filter/Setup Screen -->
      <template v-if="!isStudying">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-foreground mb-2">📚 {{ $t('study.header.title') }}</h1>
          <p class="text-gray-600">
            {{ $t('study.header.subtitle', { count: allQuestions.length }) }}
          </p>
        </div>

        <!-- Study all questions -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-foreground mb-2">{{ $t('study.allQuestions.title') }}</h2>
          <p class="text-gray-600 mb-4">{{ $t('study.allQuestions.description', { count: allQuestions.length }) }}</p>
          <button
            type="button"
            class="btn btn-primary px-8 py-3 text-lg"
            @click="startStudy"
          >
            {{ $t('study.setup.start') }}
          </button>
        </div>

        <!-- Category links -->
        <div class="card mb-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('study.categories.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NuxtLink
              v-for="cat in CATEGORIES"
              :key="cat"
              :to="`/etudier/${cat}`"
              class="p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary-50 transition-colors"
            >
              <h3 class="font-medium text-foreground">{{ $t(`categories.full.${cat}`) }}</h3>
              <p class="text-sm text-gray-500">{{ categoryCount[cat] }} questions</p>
            </NuxtLink>
          </div>
        </div>

        <!-- Related links -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <h2 class="text-lg font-semibold text-foreground mb-4">{{ $t('study.related.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink to="/quiz" class="card hover:shadow-md transition-shadow p-4">
              <h3 class="font-medium text-primary mb-1">{{ $t('study.related.quiz.title') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('study.related.quiz.description') }}</p>
            </NuxtLink>
            <NuxtLink to="/examen-civique" class="card hover:shadow-md transition-shadow p-4">
              <h3 class="font-medium text-primary mb-1">{{ $t('study.related.exam.title') }}</h3>
              <p class="text-sm text-gray-600">{{ $t('study.related.exam.description') }}</p>
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
