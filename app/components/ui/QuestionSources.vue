<script setup lang="ts">
import type { QuestionSource } from '~/types'

interface Props {
  sources: QuestionSource[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="sources && sources.length > 0" class="mt-3 pt-3 border-t border-info-200">
    <ul class="space-y-0.5">
      <li v-for="(source, index) in sources" :key="index">
        <a
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-info-600 hover:text-info-800 hover:underline inline-flex items-center gap-1"
        >
          {{ source.label }}
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </li>
    </ul>
  </div>
</template>
