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
    <header class="bg-white/80 backdrop-blur-sm border-b border-warm-200 sticky top-0 z-40" role="banner">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2.5 group">
            <div class="p-1.5 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 group-hover:from-primary-200 group-hover:to-secondary-200 transition-colors">
              <img src="/favicon.svg" alt="" class="w-6 h-6" aria-hidden="true"/>
            </div>
            <span class="font-bold text-lg text-foreground">{{ $t('nav.brand') }}</span>
          </NuxtLink>

          <!-- Desktop navigation -->
          <div class="hidden sm:flex items-center gap-2">
            <NuxtLink
              to="/examen-civique"
              class="text-warm-600 hover:text-primary hover:bg-warm-50 transition-colors py-2 px-3 rounded-lg font-medium"
            >
              {{ $t('nav.exam') }}
            </NuxtLink>
            <NuxtLink
              to="/etudier"
              class="text-warm-600 hover:text-primary hover:bg-warm-50 transition-colors py-2 px-3 rounded-lg font-medium"
            >
              {{ $t('nav.study') }}
            </NuxtLink>
            <NuxtLink
              to="/flashcards"
              class="text-warm-600 hover:text-primary hover:bg-warm-50 transition-colors py-2 px-3 rounded-lg font-medium"
            >
              {{ $t('nav.flashcards') }}
            </NuxtLink>
            <NuxtLink
              v-if="hasQuizInProgress"
              to="/quiz?new=1"
              class="text-warm-500 hover:text-warm-700 transition-colors py-2 px-2 text-sm font-medium"
            >
              {{ $t('nav.newQuiz') }}
            </NuxtLink>
            <NuxtLink
              to="/quiz"
              :class="hasQuizInProgress
                ? 'inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-600 hover:shadow-soft transition-all active:scale-[0.98]'
                : 'btn-primary text-sm'"
            >
              {{ hasQuizInProgress ? $t('home.cta.continue') : $t('nav.startQuiz') }}
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button
            type="button"
            class="sm:hidden p-2 -mr-2 text-warm-600 hover:text-foreground hover:bg-warm-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            :aria-label="t('a11y.toggleMenu')"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <IconsMenu v-if="!mobileMenuOpen" class="w-6 h-6" />
            <IconsClose v-else class="w-6 h-6" />
          </button>
        </nav>

        <!-- Mobile navigation menu -->
        <nav
          v-if="mobileMenuOpen"
          id="mobile-menu"
          class="sm:hidden pt-4 pb-2 border-t border-warm-200 mt-4 space-y-2"
          aria-label="Menu de navigation mobile"
        >
          <NuxtLink
            to="/examen-civique"
            class="block py-3 px-3 text-warm-700 hover:text-primary hover:bg-warm-50 rounded-xl transition-colors font-medium"
          >
            {{ $t('nav.exam') }}
          </NuxtLink>
          <NuxtLink
            to="/etudier"
            class="block py-3 px-3 text-warm-700 hover:text-primary hover:bg-warm-50 rounded-xl transition-colors font-medium"
          >
            {{ $t('nav.studyQuestions') }}
          </NuxtLink>
          <NuxtLink
            to="/flashcards"
            class="block py-3 px-3 text-warm-700 hover:text-primary hover:bg-warm-50 rounded-xl transition-colors font-medium"
          >
            {{ $t('nav.flashcards') }}
          </NuxtLink>
          <NuxtLink
            to="/quiz"
            :class="hasQuizInProgress
              ? 'block py-3 px-4 bg-accent text-white text-center rounded-xl hover:bg-accent-600 transition-all min-h-[44px] flex items-center justify-center font-semibold shadow-soft'
              : 'block py-3 px-4 bg-primary text-white text-center rounded-xl hover:bg-primary-600 transition-all min-h-[44px] flex items-center justify-center font-semibold shadow-soft'"
          >
            {{ hasQuizInProgress ? $t('home.cta.continue') : $t('nav.startQuiz') }}
          </NuxtLink>
          <NuxtLink
            v-if="hasQuizInProgress"
            to="/quiz?new=1"
            class="block py-3 px-4 text-warm-700 text-center rounded-xl border-2 border-warm-300 hover:bg-warm-50 transition-colors min-h-[44px] flex items-center justify-center font-semibold"
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
    <footer class="bg-warm-50 border-t border-warm-200 py-8" role="contentinfo">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="flex justify-center mb-4">
          <div class="p-2 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100">
            <img src="/favicon.svg" alt="" class="w-6 h-6" aria-hidden="true"/>
          </div>
        </div>
        <p class="text-sm text-warm-600">
          {{ $t('footer.line1') }}
        </p>
        <p class="text-sm text-warm-500 mt-1">
          {{ $t('footer.line2') }}
        </p>
        <div class="mt-4 flex justify-center gap-4">
          <NuxtLink to="/examen-civique" class="text-sm text-primary font-medium hover:text-primary-700 transition-colors">
            {{ $t('footer.exam') }}
          </NuxtLink>
          <span class="text-warm-300">·</span>
          <NuxtLink to="/a-propos" class="text-sm text-primary font-medium hover:text-primary-700 transition-colors">
            {{ $t('footer.about') }}
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
