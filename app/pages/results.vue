<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('results.meta.title'),
  description: t('results.meta.description'),
})

const router = useRouter()
const { quizResult, resetQuiz } = useQuiz()

// Redirect to home if no results available
onMounted(() => {
  if (!quizResult.value) {
    router.push('/')
  }
})

function tryAgain() {
  resetQuiz()
  router.push('/quiz')
}

function goHome() {
  resetQuiz()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div v-if="quizResult" class="space-y-8">
        <!-- Score Card -->
        <BaseCard padding="lg">
          <ResultsScore
            :score="quizResult.score"
            :total="quizResult.total"
            :passed="quizResult.passed"
            :time-spent="quizResult.timeSpent"
          />
        </BaseCard>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            class="btn btn-primary px-6 py-3 text-lg"
            @click="tryAgain"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
            {{ $t('results.actions.retry') }}
          </button>
          <button
            class="btn btn-secondary px-6 py-3 text-lg"
            @click="goHome"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            {{ $t('results.actions.home') }}
          </button>
        </div>

        <!-- Category breakdown -->
        <BaseCard padding="lg">
          <ResultsCategory :category-scores="quizResult.categoryScores" />
        </BaseCard>

        <!-- Answer review -->
        <BaseCard padding="lg">
          <ResultsReview :answers="quizResult.answers" />
        </BaseCard>
      </div>

      <!-- Loading/No results state -->
      <div v-else class="text-center py-12">
        <BaseCard padding="lg">
          <p class="text-gray-500 mb-6">
            {{ $t('results.empty.message') }}
          </p>
          <NuxtLink to="/" class="btn btn-primary">
            {{ $t('results.empty.home') }}
          </NuxtLink>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
