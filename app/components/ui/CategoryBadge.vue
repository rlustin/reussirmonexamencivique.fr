<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
  category: Category
}

const { category } = defineProps<Props>()

const categoryColors: Record<Category, string> = {
  'principes-valeurs': 'bg-info-100 text-info-700',
  'systeme-institutionnel': 'bg-secondary-100 text-secondary-700',
  'droits-devoirs': 'bg-success-100 text-success-700',
  'histoire-geographie-culture': 'bg-accent-100 text-accent-600',
  'vivre-societe': 'bg-primary-100 text-primary-700',
}
</script>

<template>
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
    :class="categoryColors[category!]"
  >
    {{ $t(`categories.short.${category}`) }}
  </span>
</template>
