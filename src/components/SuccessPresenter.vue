<script setup lang="ts">
import { useSuccessPresenterStore } from '@/stores/success-presenter'
import { computed, ref } from 'vue'

/** Approximate duration of the dialog closing animation.
 * It's needed in order to correctly show fast subsequent errors.
 */
const state = useSuccessPresenterStore()

const showToast = ref(false)
const hideTimeout = ref<number>()

function camelToSentence(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

const successTitle = computed(() => {
  const success = state.successShown
  if (success && 'title' in success) {
    const sentence = camelToSentence(success.title as string)
    const words = sentence.split(' ')
    if (words.length && words[words.length - 1].toLowerCase() === 'success') {
      words.pop()
    }
    return words.join(' ')
  } else {
    return 'Success'
  }
})
const successMessage = computed(() => {
  const success = state.successShown
  if (success && 'message' in success) {
    return success.message as string
  } else {
    return ''
  }
})
const successText = computed(() => {
  const success = state.successShown
  if (success && 'text' in success) {
    return success.text as string
  } else {
    return undefined
  }
})

const successDuration = computed(() => {
  const success = state.successShown
  if (success && 'duration' in success && typeof success.duration == 'number') {
    return success.duration as number
  } else {
    return undefined
  }
})


state.$subscribe(async () => {
  if (state.successShown) {
    showToast.value = true
    if (!!hideTimeout.value) clearTimeout(hideTimeout.value)
    hideTimeout.value = setTimeout(() => {
      showToast.value = false
      state.successWasViewed()
      hideTimeout.value = undefined
    }, successDuration.value)
  }
})
</script>

<template>
  <div
    v-if="showToast"
    class="toast toast-center toast-bottom toast-success"
  >
    <div class="alert alert-success flex flex-col">
      <span class="text-lg font-bold">{{ successTitle }}</span>
      <p v-if="successMessage">{{ successMessage }}</p>
      <p v-if="successText" class="text-sm opacity-60">{{ successText }}</p>
    </div>
  </div>
</template>
