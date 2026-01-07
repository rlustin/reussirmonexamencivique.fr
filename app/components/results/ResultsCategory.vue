<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
  categoryScores: Record<Category, { correct: number; total: number }>
}

const props = defineProps<Props>()

const categoryColors: Record<Category, { bg: string; fill: string }> = {
  'principes-valeurs': { bg: 'bg-blue-100', fill: 'bg-blue-500' },
  'systeme-institutionnel': { bg: 'bg-purple-100', fill: 'bg-purple-500' },
  'droits-devoirs': { bg: 'bg-green-100', fill: 'bg-green-500' },
  'histoire-geographie-culture': { bg: 'bg-amber-100', fill: 'bg-amber-500' },
  'vivre-societe': { bg: 'bg-rose-100', fill: 'bg-rose-500' },
}

const categories: Category[] = [
  'principes-valeurs',
  'systeme-institutionnel',
  'droits-devoirs',
  'histoire-geographie-culture',
  'vivre-societe',
]

function getPercentage(category: Category): number {
  const score = props.categoryScores[category]
  if (!score || score.total === 0) return 0
  return Math.round((score.correct / score.total) * 100)
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-foreground mb-4">
      {{ $t('results.category.title') }}
    </h3>

    <div
      v-for="category in categories"
      :key="category"
      class="space-y-2"
    >
      <div class="flex justify-between items-center text-sm">
        <span class="text-gray-700 font-medium">
          {{ $t(`categories.full.${category}`) }}
        </span>
        <span class="text-gray-500">
          {{ categoryScores[category]?.correct || 0 }}/{{ categoryScores[category]?.total || 0 }}
          <span class="ml-1 text-gray-400">({{ getPercentage(category) }}%)</span>
        </span>
      </div>

      <!-- Progress bar -->
      <div class="h-3 rounded-full overflow-hidden" :class="categoryColors[category].bg">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="categoryColors[category].fill"
          :style="{ width: `${getPercentage(category)}%` }"
        />
      </div>
    </div>
  </div>
</template>
