<script setup lang="ts">
import router from '@/router'
import { computed, onMounted, ref } from 'vue'
import DeviceRowSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import type { Device } from '@/model/devices-management/Device'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { arrayDeserializer } from '@/api/Deserializer'
import { deviceDeserializer } from '@/api/devices-management/GetDeviceDTO'
import { deviceGroupDeserializer } from '@/api/devices-management/GetDeviceGroupDTO'

const props = defineProps({ id: { type: String, required: true } })
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
async function removeDeviceFromGroup(deviceId: string) {
  try {
    loadingOverlay.startLoading()
    await authorizedRequest(`/api/deviceGroups/${props.id}/device/${deviceId}`, userInfo.token, {
      method: 'DELETE',
    })
    group.value!.devices = group.value!.devices.filter((d) => d.id != deviceId)
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  } finally {
    loadingOverlay.stopLoading()
  }
}
async function addDeviceToGroup(deviceId: string) {
  try {
    loadingOverlay.startLoading()
    await authorizedRequest(`/api/deviceGroups/${props.id}/device`, userInfo.token, {
      method: 'POST',
      body: JSON.stringify({ deviceId }),
    })
    const device = devices.value!.find((d) => d.id == deviceId)
    if (device) {
      group.value!.devices.push(device)
    }
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  } finally {
    loadingOverlay.stopLoading()
  }
}
async function deleteGroup() {
  try {
    loadingOverlay.startLoading()
    await authorizedRequest(`/api/deviceGroups/${props.id}`, userInfo.token, { method: 'DELETE' })
    router.back()
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(async () => {
  try {
    const res = await authorizedRequest(`/api/deviceGroups/${props.id}`, userInfo.token)
    group.value = await deserializeBody(res, deviceGroupDeserializer)
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  }
})
onMounted(async () => {
  try {
    const res = await authorizedRequest(`/api/devices`, userInfo.token)
    devices.value = await deserializeBody(res, arrayDeserializer(deviceDeserializer))
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  }
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
