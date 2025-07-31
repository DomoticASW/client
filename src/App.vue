<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
import ErrorPresenter from './components/ErrorPresenter.vue'
</script>

<template>
  <div class="flex justify-center">
    <ErrorPresenter>
      <LoadingOverlay>
        <div class="p-4 h-screen lg:w-full w-xl max-w-5xl">
          <RouterView />
        </div>
      </LoadingOverlay>
    </ErrorPresenter>
  </div>
</template>

<style></style>
