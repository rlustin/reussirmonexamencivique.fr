<script setup lang="ts">
interface Props {
  stats: {
    total: number
    known: number
    needsReview: number
    unseen: number
  }
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="card text-center p-4">
      <div class="text-2xl font-bold text-foreground">{{ stats.total }}</div>
      <div class="text-sm text-gray-600">{{ $t('flashcards.stats.total') }}</div>
    </div>
    <div class="card text-center p-4">
      <div class="text-2xl font-bold text-success">{{ stats.known }}</div>
      <div class="text-sm text-gray-600">{{ $t('flashcards.stats.known') }}</div>
    </div>
    <div class="card text-center p-4">
      <div class="text-2xl font-bold text-error">{{ stats.needsReview }}</div>
      <div class="text-sm text-gray-600">{{ $t('flashcards.stats.needsReview') }}</div>
    </div>
    <div class="card text-center p-4">
      <div class="text-2xl font-bold text-gray-400">{{ stats.unseen }}</div>
      <div class="text-sm text-gray-600">{{ $t('flashcards.stats.unseen') }}</div>
    </div>
  </div>
</template>
