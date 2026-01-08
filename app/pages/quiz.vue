<script setup lang="ts">
import { EXAM_CONFIG } from '~/constants/exam'

const { t } = useI18n()

useSeoMeta({
  title: t('quiz.meta.title'),
  description: t('quiz.meta.description'),
})

const router = useRouter()
const route = useRoute()

const {
  quizState,
  currentQuestion,
  currentAnswer,
  progress,
  isFirstQuestion,
  isLastQuestion,
  startQuiz,
  selectAnswer,
  goToQuestion,
  nextQuestion,
  previousQuestion,
  finishQuiz,
} = useQuiz()

const showConfirmModal = ref(false)
const showTimeoutModal = ref(false)
const quizStarted = ref(false)

const timer = useTimer({
  duration: EXAM_CONFIG.durationSeconds,
  warningThreshold: EXAM_CONFIG.warningThresholdSeconds,
  onTimeout: handleTimeout,
})

// Keyboard navigation - disabled when modals are open or quiz not started
const modalOpen = computed(() => showConfirmModal.value || showTimeoutModal.value)

useKeyboardNav({
  onSelectAnswer: selectAnswer,
  onNext: () => {
    if (isLastQuestion.value) {
      handleSubmit()
    } else {
      nextQuestion()
    }
  },
  onPrevious: previousQuestion,
  currentAnswer,
  enabled: computed(() => quizStarted.value && !modalOpen.value && !!quizState.value && !quizState.value.isFinished),
})

// Watch for ?new=1 parameter to start a new quiz (works even when already on /quiz)
watch(() => route.query.new, (newValue) => {
  if (newValue) {
    handleStartQuiz()
    router.replace('/quiz')
  }
})

function handleStartQuiz() {
  startQuiz()
  timer.reset()
  timer.start()
  quizStarted.value = true
}

onMounted(() => {
  // Check if there's an existing quiz in progress
  if (quizState.value && !quizState.value.isFinished && !route.query.new) {
    // Resuming an existing quiz - restore timer based on elapsed time
    const elapsedSeconds = Math.floor((Date.now() - quizState.value.startTime) / 1000)
    const remaining = EXAM_CONFIG.durationSeconds - elapsedSeconds
    if (remaining <= 0) {
      // Time already expired while away
      timer.setRemainingTime(0)
      quizStarted.value = true
      handleTimeout()
      return
    }
    timer.setRemainingTime(remaining)
    timer.start()
    quizStarted.value = true
  } else if (route.query.new) {
    // ?new=1 parameter - start immediately
    handleStartQuiz()
    router.replace('/quiz')
  }
  // Otherwise show the start screen
})

function handleTimeout() {
  showTimeoutModal.value = true
}

function handleSubmit() {
  const unanswered = progress.value.total - progress.value.answered
  if (unanswered > 0) {
    showConfirmModal.value = true
  } else {
    submitQuiz()
  }
}

function submitQuiz() {
  timer.stop()
  finishQuiz()
  router.push('/results')
}

function confirmSubmit() {
  showConfirmModal.value = false
  submitQuiz()
}

function cancelSubmit() {
  showConfirmModal.value = false
}

function handleTimeoutConfirm() {
  showTimeoutModal.value = false
  submitQuiz()
}

const unansweredCount = computed(() => {
  return progress.value.total - progress.value.answered
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Start screen - shown before quiz begins -->
    <div v-if="!quizStarted" class="min-h-screen flex items-center justify-center px-4">
      <BaseCard padding="lg" class="max-w-lg w-full text-center">
        <div class="space-y-6">
          <div class="space-y-2">
            <h1 class="text-2xl font-bold text-foreground">
              {{ $t('quiz.start.title') }}
            </h1>
            <p class="text-gray-600">
              {{ $t('quiz.start.description') }}
            </p>
          </div>

          <div class="flex justify-center gap-4 text-sm text-gray-500">
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('quiz.start.info.questions') }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('quiz.start.info.time') }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>{{ $t('quiz.start.info.passing') }}</span>
            </div>
          </div>

          <button
            class="btn-primary text-lg px-8 py-3 w-full"
            @click="handleStartQuiz"
          >
            {{ $t('quiz.start.button') }}
          </button>
        </div>
      </BaseCard>
    </div>

    <!-- Quiz content - shown after quiz starts -->
    <template v-else>
      <!-- Header with timer and progress -->
      <div class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <QuizTimer
              v-if="quizState"
              :formatted-time="timer.formattedTime.value"
              :percentage-remaining="timer.percentageRemaining.value"
              :is-warning="timer.isWarning.value"
            />
            <div class="text-right">
              <p class="text-lg font-semibold text-foreground">
                {{ $t('quiz.progress.question', { current: progress.current, total: progress.total }) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ $t('quiz.progress.answered', { count: progress.answered }, progress.answered) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto px-4 py-8">
        <div v-if="quizState && currentQuestion" class="space-y-8">
          <!-- Question card -->
          <BaseCard padding="lg">
            <QuizQuestion
              :question="currentQuestion"
              :selected-answer="currentAnswer"
              @select="selectAnswer"
            />
          </BaseCard>

          <!-- Navigation -->
          <QuizNavigation
            :is-first="isFirstQuestion"
            :is-last="isLastQuestion"
            :can-submit="true"
            :unanswered-count="unansweredCount"
            @previous="previousQuestion"
            @next="nextQuestion"
            @submit="handleSubmit"
          />

          <!-- Progress dots -->
          <BaseCard padding="sm">
            <QuizProgress
              :current="progress.current"
              :total="progress.total"
              :answered="progress.answered"
              :answers="quizState.answers"
              @go-to="goToQuestion"
            />
          </BaseCard>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-12">
          <LoadingSpinner size="lg" :label="$t('quiz.loading')" />
        </div>
      </div>
    </template>

    <!-- Confirm submit modal -->
    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        @keydown.escape="cancelSubmit"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
          <h3 id="confirm-modal-title" class="text-xl font-bold text-foreground">
            {{ $t('quiz.confirmModal.title') }}
          </h3>
          <p class="text-gray-600">
            {{ $t('quiz.confirmModal.message', { count: unansweredCount }) }}
          </p>
          <div class="flex gap-3 pt-2">
            <button
              class="btn btn-secondary flex-1"
              @click="cancelSubmit"
            >
              {{ $t('quiz.confirmModal.continue') }}
            </button>
            <button
              class="btn btn-primary flex-1"
              @click="confirmSubmit"
            >
              {{ $t('quiz.confirmModal.finish') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Timeout modal -->
    <Teleport to="body">
      <div
        v-if="showTimeoutModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="timeout-modal-title"
        aria-describedby="timeout-modal-description"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
          <div class="flex items-center gap-3 text-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            <h3 id="timeout-modal-title" class="text-xl font-bold">{{ $t('quiz.timeoutModal.title') }}</h3>
          </div>
          <p id="timeout-modal-description" class="text-gray-600">
            {{ $t('quiz.timeoutModal.message') }}
          </p>
          <button
            class="btn btn-primary w-full"
            @click="handleTimeoutConfirm"
          >
            {{ $t('quiz.timeoutModal.viewResults') }}
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
