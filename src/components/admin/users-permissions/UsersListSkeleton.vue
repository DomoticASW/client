<script setup lang="ts">
const props = defineProps({ nRows: { type: Number, default: 3 } })
</script>
<template>
  <ul class="list">
    <li v-for="i in [...Array(props.nRows).keys()]" v-bind:key="i" class="list-row">
      <div class="skeleton h-7 w-7 rounded-full self-center"></div>
      <div>
        <div class="skeleton h-4 w-1/4"></div>
      </div>
    </li>
  </ul>
</template>
