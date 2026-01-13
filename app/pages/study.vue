<script setup lang="ts">
import type { Question } from '~/types'
import questionsData from '../../data/questions.json'
import { shuffle } from '~/utils/shuffle'
import { CATEGORIES } from '~/constants/exam'
import { shuffleOptions } from '~/composables/useQuiz'

definePageMeta({
  path: '/etudier',
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const allQuestions = questionsData.questions as Question[]

// Quiz state
const isStudying = ref(false)
const currentIndex = ref(0)
const highlightedAnswer = ref<number | null>(null) // Pre-selection before confirming
const confirmedAnswer = ref<number | null>(null) // Confirmed answer (shows feedback)
const studyQuestions = ref<Question[]>([])
const answeredCount = ref(0)
const correctCount = ref(0)

// Computed for backward compatibility
const hasAnswered = computed(() => confirmedAnswer.value !== null)

const filteredQuestions = computed(() => allQuestions)

// Category counts for links to category pages
const categoryCount = computed(() => {
  const counts: Record<string, number> = {}
  for (const cat of CATEGORIES) {
    counts[cat] = allQuestions.filter((q) => q.category === cat).length
  }
  return counts
})

const currentQuestion = computed(() => studyQuestions.value[currentIndex.value])

function initStudySession() {
  studyQuestions.value = shuffle([...filteredQuestions.value]).map(shuffleOptions)
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
    // Second click on same option confirms it
    confirmAnswer()
  } else {
    // First click highlights
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

// Keyboard navigation for study mode
useKeyboardNav({
  onSelectAnswer: highlightAnswer,
  onNext: () => {
    // If not answered yet but something is highlighted, confirm it
    if (!hasAnswered.value && highlightedAnswer.value !== null) {
      confirmAnswer()
      return
    }
    // If answered, go to next question
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

            <!-- Explanation & Sources -->
            <div v-if="currentQuestion.explanation" class="mt-4 p-4 bg-info-50 rounded-lg border border-info-100">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm text-info-800">{{ currentQuestion.explanation }}</p>
                  <UiQuestionSources
                    v-if="currentQuestion.sources?.length"
                    :sources="currentQuestion.sources"
                  />
                </div>
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
