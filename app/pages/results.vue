<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('results.meta.title'),
  ogTitle: t('results.meta.title'),
  description: t('results.meta.description'),
  ogDescription: t('results.meta.description'),
  twitterTitle: t('results.meta.title'),
  twitterDescription: t('results.meta.description'),
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
            <IconsRefresh class="w-5 h-5 mr-2" />
            {{ $t('results.actions.retry') }}
          </button>
          <NuxtLink
            to="/etudier"
            class="btn btn-secondary px-6 py-3 text-lg"
          >
            <IconsBook class="w-5 h-5 mr-2" />
            {{ $t('results.actions.study') }}
          </NuxtLink>
          <button
            class="btn btn-secondary px-6 py-3 text-lg"
            @click="goHome"
          >
            <IconsHome class="w-5 h-5 mr-2" />
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
