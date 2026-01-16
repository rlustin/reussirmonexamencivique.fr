<script setup lang="ts">
definePageMeta({
  path: '/a-propos',
})

const { t } = useI18n()

useSeoMeta({
  title: t('about.meta.title'),
  ogTitle: t('about.meta.title'),
  description: t('about.meta.description'),
  ogDescription: t('about.meta.description'),
  twitterTitle: t('about.meta.title'),
  twitterDescription: t('about.meta.description'),
})
</script>

<template>
  <div class="py-12">
    <div class="max-w-2xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-foreground mb-8">
        {{ $t('about.title') }}
      </h1>

      <!-- About the project -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('about.project.title') }}</h2>
        <p class="text-gray-600 mb-4">
          {{ $t('about.project.description') }}
        </p>
        <p class="text-gray-600">
          {{ $t('about.project.disclaimer') }}
        </p>
      </section>

      <!-- Credits -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('about.credits.title') }}</h2>

        <div class="space-y-4">
          <!-- Questions source -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-foreground">{{ $t('about.credits.questions.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ $t('about.credits.questions.description') }}
            </p>
          </div>

          <!-- Answers disclaimer -->
          <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 class="font-medium text-foreground">{{ $t('about.credits.answers.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ $t('about.credits.answers.description') }}
            </p>
          </div>

          <!-- Icon credit -->
          <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <img src="/favicon.svg" alt="" class="w-10 h-10 flex-shrink-0" aria-hidden="true"/>
            <div>
              <h3 class="font-medium text-foreground">{{ $t('about.credits.icon.title') }}</h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ $t('about.credits.icon.description') }}
              </p>
              <a
                href="https://game-icons.net/1x1/delapouite/phrygian-cap.html"                class="text-sm text-primary hover:underline mt-2 inline-block"
              >
                game-icons.net
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Official sources -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('about.sources.title') }}</h2>
        <p class="text-gray-600 mb-4">
          {{ $t('about.sources.description') }}
        </p>

        <div class="space-y-3">
          <a
            href="https://www.service-public.fr/particuliers/actualites/A18713"            class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 class="font-medium text-primary">{{ $t('about.sources.servicePublic.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ $t('about.sources.servicePublic.description') }}
            </p>
          </a>

          <a
            href="https://formation-civique.interieur.gouv.fr/"            class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 class="font-medium text-primary">{{ $t('about.sources.formationCivique.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ $t('about.sources.formationCivique.description') }}
            </p>
          </a>

          <a
            href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052381620"            class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 class="font-medium text-primary">{{ $t('about.sources.legifrance.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">
              {{ $t('about.sources.legifrance.description') }}
            </p>
          </a>
        </div>
      </section>

      <!-- Contact -->
      <section class="card">
        <h2 class="text-xl font-semibold mb-4">{{ $t('about.contact.title') }}</h2>
        <p class="text-gray-600 mb-4">
          {{ $t('about.contact.description') }}
        </p>
        <a
          href="https://github.com/rlustin/reussirmonexamencivique.fr"          class="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <IconsGitHub class="w-5 h-5" />
          github.com/rlustin/reussirmonexamencivique.fr
        </a>
      </section>

      <!-- Back to home -->
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="btn-secondary">
          {{ $t('about.backHome') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
