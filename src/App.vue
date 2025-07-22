<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
</script>

<template>
  <div class="flex justify-center">
    <LoadingOverlay>
      <div class="p-4 h-screen w-lg">
        <RouterView />
      </div>
    </LoadingOverlay>
  </div>
</template>

<style></style>
