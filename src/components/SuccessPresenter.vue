<script setup lang="ts">
import { useSuccessPresenterStore } from '@/stores/success-presenter'
const state = useSuccessPresenterStore()
</script>

<template>
  <div class="toast toast-center toast-bottom toast-success">
    <div v-for="t in state.successQueue" :key="t.title" class="alert alert-success flex flex-col">
      <span class="text-lg font-bold">{{ t.title }}</span>
      <p v-if="t.msg" class="text-sm opacity-60">{{ t.msg }}</p>
    </div>
  </div>
</template>
