<script setup lang="ts">
import type { Category, Question } from '~/types'
import questionsData from '../../../data/questions.json'
import { shuffle } from '~/utils/shuffle'
import { CATEGORIES } from '~/constants/exam'
import { shuffleOptions } from '~/composables/useQuiz'

const route = useRoute()
const router = useRouter()
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

// Study state
const isStudying = ref(false)
const currentIndex = ref(0)
const highlightedAnswer = ref<number | null>(null)
const confirmedAnswer = ref<number | null>(null)
const studyQuestions = ref<Question[]>([])
const answeredCount = ref(0)
const correctCount = ref(0)

const hasAnswered = computed(() => confirmedAnswer.value !== null)

const currentQuestion = computed(() => studyQuestions.value[currentIndex.value])

function initStudySession() {
  studyQuestions.value = shuffle([...categoryQuestions.value]).map(shuffleOptions)
  currentIndex.value = 0
  highlightedAnswer.value = null
  confirmedAnswer.value = null
  answeredCount.value = 0
  correctCount.value = 0
  isStudying.value = true
}

function startStudy() {
  initStudySession()
  router.push({ query: { mode: 'study' } })
}

function highlightAnswer(index: number) {
  if (hasAnswered.value) return
  highlightedAnswer.value = index
}

function confirmAnswer() {
  if (hasAnswered.value || highlightedAnswer.value === null) return
  confirmedAnswer.value = highlightedAnswer.value
  answeredCount.value++
  if (confirmedAnswer.value === currentQuestion.value.correctIndex) {
    correctCount.value++
  }
}

function handleOptionClick(index: number) {
  if (hasAnswered.value) return
  if (highlightedAnswer.value === index) {
    confirmAnswer()
  } else {
    highlightAnswer(index)
  }
}

function nextQuestion() {
  if (currentIndex.value < studyQuestions.value.length - 1) {
    currentIndex.value++
    highlightedAnswer.value = null
    confirmedAnswer.value = null
  }
}

function previousQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    highlightedAnswer.value = null
    confirmedAnswer.value = null
  }
}

function exitStudy() {
  isStudying.value = false
  highlightedAnswer.value = null
  confirmedAnswer.value = null
  router.push({ query: {} })
}

const isLastQuestion = computed(() => currentIndex.value === studyQuestions.value.length - 1)

// Watch for route changes (handles browser back button)
watch(() => route.query.mode, (newMode) => {
  if (newMode === 'study' && !isStudying.value) {
    initStudySession()
  } else if (!newMode && isStudying.value) {
    isStudying.value = false
    highlightedAnswer.value = null
    confirmedAnswer.value = null
  }
})

// Initialize study mode if URL has mode=study on mount
onMounted(() => {
  if (route.query.mode === 'study') {
    initStudySession()
  }
})

// Keyboard navigation
useKeyboardNav({
  onSelectAnswer: highlightAnswer,
  onNext: () => {
    if (!hasAnswered.value && highlightedAnswer.value !== null) {
      confirmAnswer()
      return
    }
    if (hasAnswered.value) {
      if (isLastQuestion.value) {
        exitStudy()
      } else {
        nextQuestion()
      }
    }
  },
  onPrevious: previousQuestion,
  currentAnswer: highlightedAnswer,
  enabled: isStudying,
})

function getOptionClass(optIndex: number) {
  if (!hasAnswered.value) {
    return highlightedAnswer.value === optIndex
      ? 'bg-primary-50 border-primary-300'
      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 cursor-pointer'
  }

  const isCorrect = optIndex === currentQuestion.value.correctIndex
  const isSelected = optIndex === confirmedAnswer.value

  if (isCorrect) {
    return 'bg-success-50 border-success'
  }
  if (isSelected && !isCorrect) {
    return 'bg-error-50 border-error'
  }
  return 'bg-gray-50 border-gray-200'
}

function getLetterClass(optIndex: number) {
  if (!hasAnswered.value) {
    return highlightedAnswer.value === optIndex
      ? 'bg-primary text-white'
      : 'bg-gray-200 text-gray-600'
  }

  const isCorrect = optIndex === currentQuestion.value.correctIndex
  const isSelected = optIndex === confirmedAnswer.value

  if (isCorrect) {
    return 'bg-success text-white'
  }
  if (isSelected && !isCorrect) {
    return 'bg-error text-white'
  }
  return 'bg-gray-200 text-gray-600'
}

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
        <!-- Header with progress -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <button
              type="button"
              class="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              @click="exitStudy"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {{ $t('study.quiz.exit') }}
            </button>
            <div class="text-sm text-gray-600">
              {{ $t('study.quiz.score', { correct: correctCount, answered: answeredCount }) }}
            </div>
          </div>

          <div class="text-sm text-gray-600">
            {{ $t('study.quiz.progress', { current: currentIndex + 1, total: studyQuestions.length }) }}
          </div>
        </div>

        <!-- Question card -->
        <div class="card mb-6">
          <!-- Category badges -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
              {{ currentQuestion.categoryLabel }}
            </span>
            <span
              v-if="currentQuestion.isSituational"
              class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full"
            >
              {{ $t('study.badges.situational') }}
            </span>
          </div>

          <!-- Question text -->
          <h2 class="text-xl font-medium text-foreground mb-6">
            {{ currentQuestion.question }}
          </h2>

          <!-- Options -->
          <div class="space-y-3">
            <button
              v-for="(option, optIndex) in currentQuestion.options"
              :key="optIndex"
              type="button"
              class="w-full text-left p-4 rounded-lg border-2 transition-all"
              :class="getOptionClass(optIndex)"
              :disabled="hasAnswered"
              @click="handleOptionClick(optIndex)"
            >
              <div class="flex items-start gap-3">
                <span
                  class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                  :class="getLetterClass(optIndex)"
                >
                  {{ String.fromCharCode(65 + optIndex) }}
                </span>
                <span class="flex-1 pt-0.5">{{ option }}</span>
                <!-- Feedback icons -->
                <template v-if="hasAnswered">
                  <span v-if="optIndex === currentQuestion.correctIndex" class="text-success-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else-if="optIndex === confirmedAnswer" class="text-error-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </template>
              </div>
            </button>
          </div>

          <!-- Keyboard hints (hidden on mobile) -->
          <div v-if="!hasAnswered" class="hidden sm:flex items-center justify-center gap-4 pt-4 text-xs text-gray-400">
            <span>{{ $t('study.keyboard.selectHint') }}</span>
            <span class="text-gray-300">|</span>
            <span>{{ $t('study.keyboard.validateHint') }}</span>
          </div>

          <!-- Validate button -->
          <div v-if="highlightedAnswer !== null && !hasAnswered" class="mt-6 text-center">
            <button
              type="button"
              class="btn btn-primary px-8"
              @click="confirmAnswer"
            >
              {{ $t('study.quiz.validate') }}
            </button>
          </div>

          <!-- Feedback message -->
          <div v-if="hasAnswered" class="mt-6">
            <div
              v-if="confirmedAnswer === currentQuestion.correctIndex"
              class="p-4 bg-success-50 border border-success-100 rounded-lg"
            >
              <div class="flex items-center gap-2 text-success-700 font-medium">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ $t('study.quiz.correct') }}
              </div>
            </div>
            <div
              v-else
              class="p-4 bg-error-50 border border-error-100 rounded-lg"
            >
              <div class="flex items-center gap-2 text-error-700 font-medium">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ $t('study.quiz.incorrect') }}
              </div>
            </div>

            <!-- Explanation -->
            <div v-if="currentQuestion.explanation" class="mt-4 p-4 bg-info-50 rounded-lg border border-info-100">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm text-info-800">{{ currentQuestion.explanation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="currentIndex === 0"
            @click="previousQuestion"
          >
            {{ $t('study.quiz.previous') }}
          </button>

          <button
            v-if="hasAnswered && currentIndex < studyQuestions.length - 1"
            type="button"
            class="btn btn-primary"
            @click="nextQuestion"
          >
            {{ $t('study.quiz.next') }}
          </button>

          <button
            v-else-if="hasAnswered && currentIndex === studyQuestions.length - 1"
            type="button"
            class="btn btn-primary"
            @click="exitStudy"
          >
            {{ $t('study.quiz.finish') }}
          </button>

          <div v-else class="w-24" />
        </div>
      </template>
    </div>
  </div>
</template>
