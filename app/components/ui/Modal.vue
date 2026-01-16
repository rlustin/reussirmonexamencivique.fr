<script setup lang="ts">
interface Props {
  /**
   * Whether the modal is visible
   */
  show: boolean
  /**
   * The ARIA role for the modal
   * Use 'dialog' for confirmations, 'alertdialog' for alerts that require action
   */
  role?: 'dialog' | 'alertdialog'
  /**
   * ID of the element that labels the modal (for aria-labelledby)
   */
  labelledBy?: string
  /**
   * ID of the element that describes the modal (for aria-describedby)
   */
  describedBy?: string
  /**
   * Whether pressing Escape should close the modal
   */
  closeOnEscape?: boolean
  /**
   * Whether clicking the backdrop should close the modal (only applies to 'dialog' role)
   */
  closeOnBackdrop?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  role: 'dialog',
  labelledBy: undefined,
  describedBy: undefined,
  closeOnEscape: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement | null>(null)
let previouslyFocusedElement: HTMLElement | null = null

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(): HTMLElement[] {
  if (!modalRef.value) return []
  return Array.from(modalRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements()
  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  }
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    emit('close')
  }
  trapFocus(event)
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget && props.closeOnBackdrop && props.role === 'dialog') {
    emit('close')
  }
}

watch(() => props.show, (isVisible) => {
  if (isVisible) {
    previouslyFocusedElement = document.activeElement as HTMLElement
    document.addEventListener('keydown', handleKeydown)
    nextTick(() => {
      const focusableElements = getFocusableElements()
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
      else {
        modalRef.value?.focus()
      }
    })
  }
  else {
    document.removeEventListener('keydown', handleKeydown)
    previouslyFocusedElement?.focus()
    previouslyFocusedElement = null
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      ref="modalRef"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      :role="role"
      aria-modal="true"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      tabindex="-1"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
