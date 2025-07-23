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

const errorTitle = computed(() => {
  const error = state.errorShown
  if (error && '__brand' in error) {
    return error.__brand as string
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
      <div class="modal-action">
        <button class="btn btn-primary btn-soft" @click="okPressed">Ok</button>
      </div>
    </div>
  </dialog>
</template>
