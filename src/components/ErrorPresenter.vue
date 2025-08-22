<script setup lang="ts">
import { useErrorPresenterStore } from '@/stores/error-presenter'
import { computed, useTemplateRef } from 'vue'

/** Approximate duration of the dialog closing animation.
 * It's needed in order to correctly show fast subsequent errors.
 */
const dialogClosingAnimationDurationMs = 200
const state = useErrorPresenterStore()

const dialog = useTemplateRef('error-presenter-dialog')

function camelToSentence(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

const errorTitle = computed(() => {
  const error = state.errorShown
  if (error?.__brand) {
    return camelToSentence(error.__brand)
  } else {
    return 'Error'
  }
})
const errorMessage = computed(() => {
  const error = state.errorShown
  if (error?.message) {
    return error.message
  } else {
    return ''
  }
})
const errorCause = computed(() => {
  const error = state.errorShown
  if (error?.cause) {
    return error.cause
  } else {
    return undefined
  }
})

async function okPressed() {
  dialog.value!.close()
  // Waiting a bit for the animation to end.
  // If this was not done it would cause an ugly visual bug since the reactive
  // state would change immediately and the user would see the dialog text change
  // while closing.
  await new Promise((r) => setTimeout(r, dialogClosingAnimationDurationMs))
  state.errorWasViewed()
}

state.$subscribe(async () => {
  if (state.errorShown) {
    dialog.value!.showModal()
  }
})
</script>

<template>
  <slot></slot>
  <dialog ref="error-presenter-dialog" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ errorTitle }}</h3>
      <p class="whitespace-pre-line">{{ errorMessage }}</p>
      <p v-if="errorCause" class="text-sm opacity-60 whitespace-pre-line">{{ errorCause }}</p>
      <div class="modal-action">
        <button class="btn btn-primary btn-soft" @click="okPressed">Ok</button>
      </div>
    </div>
  </dialog>
</template>
