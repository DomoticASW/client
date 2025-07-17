<script setup lang="ts">
const props = defineProps({ name: { type: String } })
</script>

<template>
  <div class="px-4 pb-4 fixed bottom-0 w-[inherit]">
    <div class="flex justify-end px-5">
      <RouterLink :to="{ name: props.name }" type="button" class="btn btn-circle btn-neutral fa-solid fa-plus fa-lg !flex"></RouterLink>
    </div>
  </div>
</template>
