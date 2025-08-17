<script setup lang="ts">
import { useLoadingOverlayStore } from '@/stores/loading-overlay'

const state = useLoadingOverlayStore()
</script>

<template>
  <slot></slot>
  <transition name="fade">
    <div v-if="state.isLoading" class="fixed size-full flex justify-center">
      <div class="size-full bg-black opacity-30"></div>
      <div class="fixed loading loading-spinner self-center text-primary loading-xl"></div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.3s ease-out 150ms;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
