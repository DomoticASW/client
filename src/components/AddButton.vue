<script setup lang="ts">
const props = defineProps({
  name: { type: String }
})
const emit = defineEmits<{ onclick: [] }>()

function onclick() {
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
</template>
