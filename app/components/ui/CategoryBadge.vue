<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
  category: Category
}

const { category } = defineProps<Props>()

const categoryColors: Record<Category, string> = {
  'principes-valeurs': 'bg-blue-100 text-blue-800',
  'systeme-institutionnel': 'bg-purple-100 text-purple-800',
  'droits-devoirs': 'bg-green-100 text-green-800',
  'histoire-geographie-culture': 'bg-amber-100 text-amber-800',
  'vivre-societe': 'bg-rose-100 text-rose-800',
}
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="categoryColors[category!]"
  >
    {{ $t(`categories.short.${category}`) }}
  </span>
</template>
