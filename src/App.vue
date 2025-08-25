<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
import ErrorPresenter from './components/ErrorPresenter.vue'
import SuccessPresenter from './components/SuccessPresenter.vue'
</script>

<template>
  <div class="flex justify-center">
    <ErrorPresenter>
        <LoadingOverlay>
          <div class="h-full md:w-full w-xl max-w-5xl">
            <SuccessPresenter>
            </SuccessPresenter>
            <RouterView />
          </div>
        </LoadingOverlay>

    </ErrorPresenter>
  </div>
</template>

<style></style>
