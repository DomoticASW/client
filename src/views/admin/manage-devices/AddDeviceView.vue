<script setup lang="ts">
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { Device } from '@/model/devices-management/Device'
import type { DiscoveredDevice } from '@/model/devices-management/DiscoveredDevice'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { authorizedRequest } from '@/utils'
import { onMounted, ref } from 'vue'
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const devices = ref<DiscoveredDevice[] | undefined>()

const successAlertId = 'success_alert_id'
const successAlert = () => document.getElementById(successAlertId)!
async function addDevice(id: string) {
  const deviceToAdd = devices.value!.find((d) => d.id == id)!
  const host = deviceToAdd.address.host
  const port = deviceToAdd.address.port
  try {
    loadingOverlay.startLoading()
    await authorizedRequest('/api/devices', userInfo.token, {
      method: 'POST',
      body: JSON.stringify({ deviceAddress: { host, port } }),
    })
    devices.value = devices.value!.filter((d) => d.id != id)
    successAlert().classList.remove('opacity-0')
    setTimeout(() => successAlert().classList.add('opacity-0'), 2000)
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(async () => {
  try {
    const { json } = await authorizedRequest('/api/discovered-devices', userInfo.token)
    devices.value = json as Device[]
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  }
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
      :id="successAlertId"
      role="alert"
      class="alert alert-success fixed bottom-1 inset-x-1 opacity-0 transition-all duration-300"
    >
      <span class="fa-solid fa-circle-check fa-xl"></span>
      Device added!
    </div>
  </div>
</template>

<style></style>
