<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = defineProps({
  name: { type: String },
  showModalWhenNameNotProvided: { type: Boolean, default: true },
})
const emit = defineEmits<{ onclick: [] }>()
const addButtonModal = useTemplateRef('addButtonModal')

function onclick() {
  if (props.showModalWhenNameNotProvided) {
    addButtonModal.value?.showModal()
  }
  emit('onclick')
}
</script>

<template>
  <div class="px-4 pb-4 fixed bottom-0 max-w-[inherit] w-[inherit]">
    <div class="flex justify-end px-5">
      <RouterLink
        v-if="name"
        :to="{ name: props.name }"
        type="button"
        class="btn btn-circle btn-base-300 shadow fa-solid fa-plus fa-lg !flex"
      ></RouterLink>
      <template v-else>
        <button
          type="button"
          :onclick="onclick"
          class="btn btn-circle btn-base-300 fa-solid fa-plus fa-lg !flex"
        ></button>
      </template>
    </div>
  </div>

  <dialog ref="addButtonModal" class="modal modal-end">
    <div class="modal-box sm:w-4/12 w-7/12 max-w-screen">
      <slot></slot>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>
</template>
