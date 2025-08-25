<script setup lang="ts">
const props = defineProps({
  name: { type: String },
})
const emit = defineEmits<{ onclick: [] }>()

function onclick() {
  emit('onclick')
}
</script>

<template>
  <div class="px-4 pb-4 fixed bottom-3 max-w-[inherit] w-[inherit] pointer-events-none">
    <div class="flex justify-end px-5">
      <RouterLink
        v-if="name"
        :to="{ name: props.name }"
        type="button"
        class="btn btn-primary shadow !flex items-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:gap-2 rounded-full sm:rounded-lg py-2 pointer-events-auto"
      >
        <span class="hidden sm:inline text-lg font-semibold">Add</span>
        <i class="fa-solid fa-plus fa-lg"></i>
      </RouterLink>

      <template v-else>
        <button
          type="button"
          :onclick="onclick"
          class="btn btn-primary shadow !flex items-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:gap-2 rounded-full sm:rounded-lg py-2 pointer-events-auto"
        >
          <span class="hidden sm:inline text-lg font-semibold">Add</span>
          <i class="fa-solid fa-plus fa-lg"></i>
        </button>
      </template>
    </div>
  </div>
</template>
