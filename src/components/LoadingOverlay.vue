<script setup lang="ts">
import { useLoadingOverlayStore } from '@/stores/loading-overlay'

defineProps({
  overlayOpacity: { type: Number, default: 40 },
  zIndex: { type: Number, default: 999 },
})
const state = useLoadingOverlayStore()
</script>

<template>
  <div
    class="fixed size-full flex justify-center"
    :class="[{ hidden: !state.isLoading }, `z-${zIndex}`]"
  >
    <div class="size-full bg-black" :class="`opacity-${overlayOpacity}`"></div>
    <div class="fixed loading loading-spinner self-center text-primary loading-xl"></div>
  </div>
  <slot></slot>
</template>
