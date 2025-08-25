<script setup lang="ts">
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DiscoveredDevice } from '@/model/devices-management/DiscoveredDevice'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import * as api from '@/api/devices-management/requests/devices'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import NavbarLayout from '@/components/NavbarLayout.vue'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const successPresenter = useSuccessPresenterStore()
const devices = ref<DiscoveredDevice[] | undefined>()

async function addDevice(id: string) {
  const deviceToAdd = devices.value!.find((d) => d.id == id)!
  const host = deviceToAdd.address.host
  const port = deviceToAdd.address.port
  try {
    loadingOverlay.startLoading()
    await api.registerDevice({ host, port }, userInfo.token)
    devices.value = devices.value!.filter((d) => d.id != id)
    successPresenter.showSuccess(presentSuccess(`${deviceToAdd.name} added!`))
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(async () => {
  devices.value = await api.getAllDiscoveredDevices(userInfo.token)
})
</script>

<template>
  <NavbarLayout title="Add device" :show-back-button="true">
    <ul v-if="devices" class="list">
      <li v-for="d in devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button class="btn btn-circle btn-ghost fa-solid fa-plus" v-on:click="addDevice(d.id)"></button>
      </li>
    </ul>
    <DeviceListSkeleton v-else />
  </NavbarLayout>
</template>

<style></style>
