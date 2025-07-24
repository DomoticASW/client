<script setup lang="ts">
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DiscoveredDevice } from '@/model/devices-management/DiscoveredDevice'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref, useTemplateRef } from 'vue'
import * as api from '@/api/devices-management/requests/devices'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const devices = ref<DiscoveredDevice[] | undefined>()

const successAlert = useTemplateRef('success_alert_id')
async function addDevice(id: string) {
  const deviceToAdd = devices.value!.find((d) => d.id == id)!
  const host = deviceToAdd.address.host
  const port = deviceToAdd.address.port
  try {
    loadingOverlay.startLoading()
    await api.registerDevice({ host, port }, userInfo.token)
    devices.value = devices.value!.filter((d) => d.id != id)
    successAlert.value?.classList.remove('opacity-0')
    setTimeout(() => successAlert.value?.classList.add('opacity-0'), 2000)
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(async () => {
  devices.value = await api.getAllDiscoveredDevices(userInfo.token)
})
</script>

<template>
  <div class="relative">
    <div class="navbar">
      <h1 class="text-2xl">Add device</h1>
    </div>
    <ul v-if="devices" class="list">
      <li v-for="d in devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button class="btn btn-ghost fa-solid fa-plus" v-on:click="addDevice(d.id)"></button>
      </li>
    </ul>
    <DeviceListSkeleton v-else />
    <div
      ref="success_alert_id"
      role="alert"
      class="alert alert-success fixed bottom-1 inset-x-1 opacity-0 transition-all duration-300"
    >
      <span class="fa-solid fa-circle-check fa-xl"></span>
      Device added!
    </div>
  </div>
</template>

<style></style>
