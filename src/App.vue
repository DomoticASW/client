<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingOverlay from './components/LoadingOverlay.vue'
import ErrorPresenter from './components/ErrorPresenter.vue'
import SuccessPresenter from './components/SuccessPresenter.vue'
import DeviceGroupsDialog from './components/DeviceGroupsDialog.vue'
</script>

<template>
  <div class="flex justify-center">
    <ErrorPresenter>
        <LoadingOverlay>
          <div class="h-full w-full max-w-5xl">
            <RouterView />
            <SuccessPresenter>
            </SuccessPresenter>
            <DeviceGroupsDialog/>
          </div>
        </LoadingOverlay>

    </ErrorPresenter>
  </div>
</template>

<style></style>
