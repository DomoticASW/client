<script setup lang="ts">
import { useErrorPresenterStore } from '@/stores/error-presenter'
import { computed, onMounted, ref } from 'vue'

const state = useErrorPresenterStore()

const dialogId = 'error-presenter-dialog'
const dialog = ref<HTMLDialogElement | undefined>()

const errorTitle = computed(() => {
  const error = state.errorShown ?? state.lastShownError
  if (error && '__brand' in error) {
    return error.__brand as string
  } else {
    return 'Error'
  }
})
const errorMessage = computed(() => {
  const error = state.errorShown ?? state.lastShownError
  if (error && 'message' in error) {
    return error.message as string
  } else {
    return undefined
  }
})

state.$subscribe(async () => {
  if (state.errorShown) {
    dialog.value!.showModal()
  } else {
    dialog.value!.close()
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
        <button class="btn btn-primary btn-soft" @click="state.stopShowingError()">Ok</button>
      </div>
    </div>
  </dialog>
</template>
