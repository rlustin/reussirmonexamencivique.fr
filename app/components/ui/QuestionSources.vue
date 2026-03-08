<script setup lang="ts">
import type { QuestionSource } from '~/types'

interface Props {
  sources: QuestionSource[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="sources && sources.length > 0" class="mt-3 pt-3 border-t border-secondary-200">
    <ul class="space-y-0.5">
      <li v-for="(source, index) in sources" :key="index">
        <a
          :href="source.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-secondary-600 hover:text-secondary-800 hover:underline inline-flex items-center gap-1"
        >
          {{ source.label }}
          <IconsExternalLink class="w-3 h-3" />
        </a>
      </li>
    </ul>
  </div>
</template>
