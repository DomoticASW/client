<script setup lang="ts">
import router from '@/router'
import { computed, onMounted, ref } from 'vue'
import DeviceRowSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import { DeviceGroupId, type DeviceGroup } from '@/model/devices-management/DeviceGroup'
import type { Device, DeviceId } from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import * as api from '@/api/devices-management/requests/device-groups'
import * as devicesApi from '@/api/devices-management/requests/devices'

const props = defineProps({ id: { type: String, required: true } })
const groupId = DeviceGroupId(props.id)
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()

const group = ref<DeviceGroup | undefined>(undefined)
const devices = ref<Device[] | undefined>(undefined)

const devicesNotInGroup = computed(() => {
  if (group.value && devices.value)
    return devices.value.filter(
      (d) => group.value!.devices.find((d2) => d.id == d2.id) == undefined,
    )
  else return undefined
})
async function removeDeviceFromGroup(deviceId: DeviceId) {
  try {
    loadingOverlay.startLoading()
    await api.removeDeviceFromDeviceGroup(groupId, deviceId, userInfo.token)
    group.value!.devices = group.value!.devices.filter((d) => d.id != deviceId)
  } finally {
    loadingOverlay.stopLoading()
  }
}
async function addDeviceToGroup(deviceId: DeviceId) {
  try {
    loadingOverlay.startLoading()
    await api.addDeviceToDeviceGroup(groupId, deviceId, userInfo.token)
    const device = devices.value!.find((d) => d.id == deviceId)
    if (device) {
      group.value!.devices.push(device)
    }
  } finally {
    loadingOverlay.stopLoading()
  }
}
async function deleteGroup() {
  try {
    loadingOverlay.startLoading()
    await api.deleteDeviceGroup(groupId, userInfo.token)
    router.back()
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(async () => {
  group.value = await api.findDeviceGroup(groupId, userInfo.token)
})
onMounted(async () => {
  devices.value = await devicesApi.getAllDevices(userInfo.token)
})
</script>

<template>
  <div class="navbar flex justify-between">
    <h1 class="text-2xl" :class="{ 'skeleton h-4 w-1/2': !group }">{{ group?.name }}</h1>
    <button class="btn btn-ghost text-error" @click="deleteGroup">Delete</button>
  </div>
  <ul v-if="group" class="list">
    <li v-for="d in group.devices" v-bind:key="d.id" class="list-row">
      <span class="fa-solid fa-microchip text-2xl self-center"></span>
      <div>
        {{ d.name }}
        <br />
        <span class="text-xs">id: {{ d.id }}</span>
      </div>
      <button
        class="btn btn-ghost fa-solid fa-remove"
        @click="removeDeviceFromGroup(d.id)"
      ></button>
    </li>
  </ul>
  <DeviceRowSkeleton v-else />

  <div class="divider"></div>

  <h2 v-if="devices" class="text-xl">Devices not in group</h2>
  <div v-else class="skeleton h-4 w-1/2"></div>

  <ul v-if="devices" class="list">
    <li v-for="d in devicesNotInGroup" v-bind:key="d.id" class="list-row">
      <span class="fa-solid fa-microchip text-2xl self-center"></span>
      <div>
        {{ d.name }}
        <br />
        <span class="text-xs">id: {{ d.id }}</span>
      </div>
      <button class="btn btn-ghost fa-solid fa-add" @click="addDeviceToGroup(d.id)"></button>
    </li>
  </ul>
  <DeviceRowSkeleton v-else :nRows="5" />
</template>

<style></style>
