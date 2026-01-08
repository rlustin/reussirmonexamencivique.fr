<script setup lang="ts">
const { t } = useI18n()
const mobileMenuOpen = ref(false)
const route = useRoute()
const { quizState } = useQuiz()

// Check if a quiz is in progress (not finished)
const hasQuizInProgress = computed(() => {
  return quizState.value && !quizState.value.isFinished
})

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Skip to content link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {{ $t('a11y.skipToContent') }}
    </a>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200" role="banner">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/favicon.svg" alt="" class="w-8 h-8" aria-hidden="true">
            <span class="font-semibold text-lg text-foreground">{{ $t('nav.brand') }}</span>
          </NuxtLink>

          <!-- Desktop navigation -->
          <div class="hidden sm:flex items-center gap-4">
            <NuxtLink
              to="/etudier"
              class="text-gray-600 hover:text-primary transition-colors py-2 px-3"
            >
              {{ $t('nav.study') }}
            </NuxtLink>
            <NuxtLink
              v-if="hasQuizInProgress"
              to="/quiz?new=1"
              class="text-gray-500 hover:text-gray-700 transition-colors py-2 px-2 text-sm"
            >
              {{ $t('nav.newQuiz') }}
            </NuxtLink>
            <NuxtLink
              to="/quiz"
              :class="hasQuizInProgress
                ? 'inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600 transition-colors'
                : 'btn-primary text-sm'"
            >
              {{ hasQuizInProgress ? $t('home.cta.continue') : $t('nav.startQuiz') }}
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            type="button"
            class="sm:hidden p-2 -mr-2 text-gray-600 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            :aria-label="t('a11y.toggleMenu')"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </nav>

        <!-- Mobile navigation menu -->
        <nav
          v-if="mobileMenuOpen"
          id="mobile-menu"
          class="sm:hidden pt-4 pb-2 border-t border-gray-100 mt-4 space-y-2"
          aria-label="Menu de navigation mobile"
        >
          <NuxtLink
            to="/etudier"
            class="block py-3 px-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
          >
            {{ $t('nav.studyQuestions') }}
          </NuxtLink>
          <NuxtLink
            to="/quiz"
            :class="hasQuizInProgress
              ? 'block py-3 px-4 bg-accent text-white text-center rounded-lg hover:bg-accent-600 transition-colors min-h-[44px] flex items-center justify-center'
              : 'block py-3 px-4 bg-primary text-white text-center rounded-lg hover:bg-primary-700 transition-colors min-h-[44px] flex items-center justify-center'"
          >
            {{ hasQuizInProgress ? $t('home.cta.continue') : $t('nav.startQuiz') }}
          </NuxtLink>
          <NuxtLink
            v-if="hasQuizInProgress"
            to="/quiz?new=1"
            class="block py-3 px-4 text-gray-600 text-center rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors min-h-[44px] flex items-center justify-center"
          >
            {{ $t('nav.newQuiz') }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main id="main-content" class="flex-1" role="main" tabindex="-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6" role="contentinfo">
      <div class="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          {{ $t('footer.line1') }}
        </p>
        <p class="mt-1">
          {{ $t('footer.line2') }}
        </p>
        <p class="mt-3">
          <NuxtLink to="/a-propos" class="text-primary hover:underline">
            {{ $t('footer.about') }}
          </NuxtLink>
        </p>
      </div>
    </footer>
  </div>
</template>
