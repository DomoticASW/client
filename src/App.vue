<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex justify-center">
    <div class="grid grid-cols-1 gap-4 p-4 h-screen w-md">
        <RouterView />
    </div>
  </div>
</template>

<style>
</style>
