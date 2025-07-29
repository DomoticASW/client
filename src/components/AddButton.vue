<script setup lang="ts">
const props = defineProps<{ name?: string; modal: boolean }>()
</script>

<template>
  <div class="px-4 pb-4 fixed bottom-0 max-w-[inherit] w-[inherit]">
    <div class="flex justify-end px-5">
      <template v-if="modal">
        <button
          type="button"
          onclick="addButtonModal.showModal()"
          class="btn btn-circle btn-neutral fa-solid fa-plus fa-lg !flex"
        ></button>
      </template>
      <RouterLink
        v-else
        :to="{ name: props.name }"
        type="button"
        class="btn btn-circle btn-neutral fa-solid fa-plus fa-lg !flex"
      ></RouterLink>
    </div>
  </div>

  <dialog id="addButtonModal" class="modal modal-end">
    <div class="modal-box">
      <slot></slot>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>
</template>
