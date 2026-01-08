<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const { variant, size, disabled } = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary',
  secondary: 'bg-gray-100 text-foreground hover:bg-gray-200 focus:ring-gray-500',
  success: 'bg-success text-white hover:bg-success-700 focus:ring-success',
  error: 'bg-error text-white hover:bg-error-700 focus:ring-error',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
}
</script>

<template>
  <button
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variantClasses[variant!], sizeClasses[size!]]"
  >
    <slot />
  </button>
</template>
