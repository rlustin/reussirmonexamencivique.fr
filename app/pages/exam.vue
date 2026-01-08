<script setup lang="ts">
definePageMeta({
  path: '/examen-civique',
})

const { t } = useI18n()

useSeoMeta({
  title: t('exam.meta.title'),
  description: t('exam.meta.description'),
})
</script>

<template>
  <div class="py-12">
    <div class="max-w-2xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-foreground mb-8">
        {{ $t('exam.title') }}
      </h1>

      <!-- What is it -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('exam.what.title') }}</h2>
        <p class="text-gray-600 mb-4">
          {{ $t('exam.what.description') }}
        </p>
        <p class="text-gray-600">
          {{ $t('exam.what.since') }}
        </p>
      </section>

      <!-- Exam format -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('exam.format.title') }}</h2>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">40</div>
            <div class="text-sm text-gray-600">{{ $t('exam.format.questions') }}</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">45 min</div>
            <div class="text-sm text-gray-600">{{ $t('exam.format.duration') }}</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">32/40</div>
            <div class="text-sm text-gray-600">{{ $t('exam.format.passing') }}</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">80 %</div>
            <div class="text-sm text-gray-600">{{ $t('exam.format.successRate') }}</div>
          </div>
        </div>

        <div class="space-y-3 text-gray-600">
          <p>{{ $t('exam.format.breakdown') }}</p>
          <ul class="list-disc list-inside space-y-1 ml-2">
            <li>{{ $t('exam.format.knowledge') }}</li>
            <li>{{ $t('exam.format.situational') }}</li>
          </ul>
          <p>{{ $t('exam.format.mcq') }}</p>
        </div>
      </section>

      <!-- Who is concerned -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('exam.who.title') }}</h2>

        <p class="text-gray-600 mb-4">{{ $t('exam.who.intro') }}</p>

        <ul class="list-disc list-inside space-y-2 text-gray-600 mb-4 ml-2">
          <li>{{ $t('exam.who.naturalization') }}</li>
          <li>{{ $t('exam.who.residenceCard') }}</li>
        </ul>

        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="font-medium text-foreground mb-2">{{ $t('exam.who.exceptions.title') }}</h3>
          <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
            <li>{{ $t('exam.who.exceptions.renewal') }}</li>
            <li>{{ $t('exam.who.exceptions.protection') }}</li>
          </ul>
        </div>
      </section>

      <!-- Topics -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('exam.topics.title') }}</h2>
        <p class="text-gray-600 mb-4">{{ $t('exam.topics.intro') }}</p>

        <div class="space-y-3">
          <div class="p-3 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-foreground">1. {{ $t('categories.full.principes-valeurs') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('exam.topics.principles') }}</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-foreground">2. {{ $t('categories.full.systeme-institutionnel') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('exam.topics.institutions') }}</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-foreground">3. {{ $t('categories.full.droits-devoirs') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('exam.topics.rights') }}</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-foreground">4. {{ $t('categories.full.histoire-geographie-culture') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('exam.topics.history') }}</p>
          </div>
          <div class="p-3 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-foreground">5. {{ $t('categories.full.vivre-societe') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('exam.topics.society') }}</p>
          </div>
        </div>
      </section>

      <!-- Civic training -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('exam.training.title') }}</h2>
        <p class="text-gray-600 mb-4">{{ $t('exam.training.description') }}</p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">4</div>
            <div class="text-sm text-gray-600">{{ $t('exam.training.days') }}</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-3xl font-bold text-primary">24h</div>
            <div class="text-sm text-gray-600">{{ $t('exam.training.hours') }}</div>
          </div>
        </div>

        <p class="text-gray-600">{{ $t('exam.training.certificate') }}</p>
      </section>

      <!-- Official sources -->
      <section class="card mb-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('exam.sources.title') }}</h2>
        <p class="text-gray-600 mb-4">{{ $t('exam.sources.description') }}</p>

        <div class="space-y-3">
          <a
            href="https://www.service-public.fr/particuliers/actualites/A18713"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 class="font-medium text-primary">{{ $t('about.sources.servicePublic.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('about.sources.servicePublic.description') }}</p>
          </a>

          <a
            href="https://formation-civique.interieur.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 class="font-medium text-primary">{{ $t('about.sources.formationCivique.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('about.sources.formationCivique.description') }}</p>
          </a>

          <a
            href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052381620"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 class="font-medium text-primary">{{ $t('about.sources.legifrance.title') }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ $t('about.sources.legifrance.description') }}</p>
          </a>
        </div>
      </section>

      <!-- CTA -->
      <div class="text-center">
        <p class="text-gray-600 mb-6">{{ $t('exam.cta.intro') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/quiz" class="btn-primary text-lg px-8 py-3">
            {{ $t('exam.cta.quiz') }}
          </NuxtLink>
          <NuxtLink to="/etudier" class="btn-secondary text-lg px-8 py-3">
            {{ $t('exam.cta.study') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Back to home -->
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="btn-secondary">
          {{ $t('about.backHome') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
