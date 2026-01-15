/**
 * Helper utilities for localStorage operations with SSR safety and error handling
 */

/**
 * Safely load data from localStorage with SSR check and error handling
 */
export function loadFromStorage<T>(key: string, defaults: T): T {
  if (import.meta.server) return { ...defaults }

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return { ...defaults, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.warn(`[storage] Failed to load "${key}" from localStorage:`, error)
  }
  return { ...defaults }
}

/**
 * Safely save data to localStorage with SSR check and error handling
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (import.meta.server) return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn(`[storage] Failed to save "${key}" to localStorage:`, error)
  }
}

/**
 * Creates a reactive state that syncs with localStorage.
 * Handles SSR hydration by loading from localStorage in onMounted.
 *
 * @param stateKey - Key for useState (Nuxt's state management)
 * @param storageKey - Key for localStorage
 * @param defaults - Default values for initial state
 * @param mergeStrategy - Optional custom merge function for nested objects
 */
export function useStoredState<T extends object>(
  stateKey: string,
  storageKey: string,
  defaults: T,
  mergeStrategy?: (defaults: T, stored: Partial<T>) => T
) {
  const state = useState<T>(stateKey, () => loadFromStorage(storageKey, defaults))
  const isLoaded = useState(`${stateKey}-loaded`, () => false)

  // Load from localStorage on client-side after hydration
  onMounted(() => {
    if (!isLoaded.value) {
      const stored = loadFromStorage(storageKey, defaults)
      if (mergeStrategy) {
        state.value = mergeStrategy(defaults, stored)
      } else {
        state.value = stored
      }
      isLoaded.value = true
    }
  })

  function save() {
    saveToStorage(storageKey, state.value)
  }

  function reset() {
    state.value = { ...defaults }
    save()
  }

  return {
    state,
    isLoaded: readonly(isLoaded),
    save,
    reset,
  }
}
