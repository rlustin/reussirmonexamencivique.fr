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
    <div class="max-w-5xl mx-auto px-4">
      <!-- Filter/Setup Screen -->
      <template v-if="!isStudying">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">{{ $t('study.header.title') }}</h1>
          <p class="text-warm-600">
            {{ $t('study.header.subtitle', { count: allQuestions.length }) }}
          </p>
        </div>

        <!-- Bento grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <!-- Study all tile — 2 cols, 3 rows -->
          <div class="bento-tile col-span-2 md:row-span-3 bg-gradient-to-br from-secondary to-secondary-700 text-white flex flex-col justify-between">
            <div>
              <div class="p-2 rounded-xl bg-white/20 w-fit mb-4">
                <IconsBook class="w-6 h-6" />
              </div>
              <h2 class="text-2xl font-extrabold leading-tight mb-2">{{ $t('study.allQuestions.title') }}</h2>
              <p class="text-white/80 text-sm leading-relaxed">{{ $t('study.allQuestions.description', { count: allQuestions.length }) }}</p>
            </div>
            <div class="mt-6">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl bg-white text-secondary-700 hover:bg-secondary-50 transition-all px-6 py-3 font-bold active:scale-[0.98] text-center cursor-pointer"
                @click="startStudy"
              >
                {{ $t('study.setup.start') }}
              </button>
            </div>
          </div>

          <!-- 5 category tiles beside and below the hero (fill 2 right cols) -->
          <NuxtLink
            v-for="cat in CATEGORIES"
            :key="cat"
            :to="`/etudier/${cat}`"
            class="bento-tile bg-white group hover:shadow-soft-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <h3 class="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">{{ $t(`categories.full.${cat}`) }}</h3>
            <div class="mt-3">
              <span class="text-xs text-warm-500 bg-warm-100 px-2.5 py-0.5 rounded-full">{{ categoryCount[cat] }}</span>
            </div>
          </NuxtLink>

          <!-- Empty spacer to complete the grid row (5 tiles = 2+2+1, need 1 more) -->
          <div class="hidden md:block" />

          <!-- Quiz CTA tile -->
          <NuxtLink
            to="/quiz"
            class="bento-tile col-span-2 bg-gradient-to-br from-primary to-primary-600 text-white group hover:shadow-soft-lg hover:-translate-y-0.5 transition-all flex items-start gap-4"
          >
            <div class="p-2 rounded-xl bg-white/20 shrink-0">
              <IconsClipboardList class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-lg">{{ $t('study.related.quiz.title') }}</h3>
              <p class="text-white/80 text-sm mt-1">{{ $t('study.related.quiz.description') }}</p>
            </div>
          </NuxtLink>

          <!-- Exam info tile -->
          <NuxtLink
            to="/examen-civique"
            class="bento-tile col-span-2 bg-white group hover:shadow-soft-lg hover:-translate-y-0.5 transition-all flex items-start gap-4"
          >
            <div class="p-2 rounded-xl bg-secondary-100 shrink-0">
              <IconsInfoCircle class="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 class="font-bold text-lg text-foreground group-hover:text-secondary-600 transition-colors">{{ $t('study.related.exam.title') }}</h3>
              <p class="text-warm-600 text-sm mt-1">{{ $t('study.related.exam.description') }}</p>
            </div>
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
