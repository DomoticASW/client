<script setup lang="ts">
import { useErrorPresenterStore } from '@/stores/error-presenter'
import { computed, onMounted, ref } from 'vue'

/** Approximate duration of the dialog closing animation.
 * It's needed in order to correctly show fast subsequent errors.
 */
const dialogClosingAnimationDurationMs = 200
const state = useErrorPresenterStore()

const dialogId = 'error-presenter-dialog'
const dialog = ref<HTMLDialogElement | undefined>()

function camelToSentence(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

const errorTitle = computed(() => {
  const error = state.errorShown
  if (error && '__brand' in error) {
    const sentence = camelToSentence(error.__brand as string)
    const words = sentence.split(' ')
    if (words.length && words[words.length - 1].toLowerCase() === 'error') {
      words.pop()
    }
    return words.join(' ')
  } else {
    return 'Error'
  }
})
const errorMessage = computed(() => {
  const error = state.errorShown
  if (error && 'message' in error) {
    return error.message as string
  } else {
    return ''
  }
})
const errorCause = computed(() => {
  const error = state.errorShown
  if (error && 'cause' in error) {
    return error.cause as string
  } else {
    return undefined
  }
})

async function okPressed() {
  dialog.value!.close()
  await new Promise((r) => setTimeout(r, dialogClosingAnimationDurationMs))
  state.errorWasViewed()
}

state.$subscribe(async () => {
  if (state.errorShown) {
    dialog.value!.showModal()
  }
})
onMounted(() => {
  dialog.value = document.getElementById(dialogId) as HTMLDialogElement
})
</script>

<template>
  <slot></slot>
  <dialog :id="dialogId" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ errorTitle }}</h3>
      <p>{{ errorMessage }}</p>
      <p v-if="errorCause" class="text-sm opacity-60">{{ errorCause }}</p>
      <div class="modal-action">
        <button class="btn btn-primary btn-soft" @click="okPressed">Ok</button>
      </div>
    </div>
  </dialog>
</template>
