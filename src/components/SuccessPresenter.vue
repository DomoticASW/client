<script setup lang="ts">
import { useSuccessPresenterStore } from '@/stores/success-presenter'
import { ref } from 'vue'

/** Approximate duration of the dialog closing animation.
 * It's needed in order to correctly show fast subsequent errors.
 */
const state = useSuccessPresenterStore()
const hideTimeout = ref<number>()

state.$subscribe(async () => {
  if (state.successShown) {
    if (!!hideTimeout.value) clearTimeout(hideTimeout.value)
    hideTimeout.value = setTimeout(() => {
      state.successWasViewed()
      hideTimeout.value = undefined
    }, state.successShown.duration)
  }
})
</script>

<template>
  <div class="toast toast-center toast-bottom toast-success">
    <div v-for="t in state.successQueue" :key="t.title" class="alert alert-success flex flex-col">
      <span class="text-lg font-bold">{{ t.title }}</span>
      <p v-if="t.msg" class="text-sm opacity-60">{{ t.msg }}</p>
    </div>
  </div>
</template>
