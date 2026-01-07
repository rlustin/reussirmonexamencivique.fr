<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
})

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200"
    :class="paddingClasses[padding]"
  >
    <slot />
  </div>
</template>
