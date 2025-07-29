<script setup lang="ts">
import { getAllDeviceGroups } from '@/api/devices-management/requests/device-groups'
import { getAllDevices } from '@/api/devices-management/requests/devices'
import type { Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const userInfo = useUserInfoStore()
const groups = ref<DeviceGroup[]>()
const devices = ref<Device[]>()
const selectedGroup = ref<DeviceGroup | undefined>(undefined)

onMounted(async () => {
  groups.value = await getAllDeviceGroups(userInfo.token)
  devices.value = await getAllDevices(userInfo.token)
})
</script>

<template>
  <div class="grid grid-cols-3">
    <h3 class="text-xl col-span-3">Devices</h3>
    <select v-model="selectedGroup" class="select ml-4 my-4 col-span-3 text-lg">
      <option selected :value=undefined>All devices</option>
      <option v-for="group in groups" :key="group.id" :value="group">{{ group.name }}</option>
    </select>

    <button type="button" v-for="device in (selectedGroup ? selectedGroup.devices : devices)" :key="device.id" class="btn justify-start my-1 col-span-2 ml-4">
      {{ device.name }}
    </button>
  </div>
  <div class="grid grid-cols-3">
    <h3 class="text-xl col-span-3 mb-2 mt-1">Control flow</h3>
    <button type="button" class="btn justify-start my-1 col-span-2">
      If
    </button>
    <button type="button" class="btn justify-start my-1 col-span-2">
      If-Else
    </button>
  </div>
  <div class="grid grid-cols-3">
    <h3 class="text-xl col-span-3 mb-2 mt-1">Others</h3>
    <button type="button" class="btn justify-start col-span-2 my-1">
      Wait
    </button>
    <button type="button" class="btn justify-start col-span-2 my-1">
      Start task
    </button>
    <button type="button" class="btn justify-start col-span-2 my-1">
      Constant
    </button>
    <button type="button" class="btn justify-start col-span-2 my-1">
      Send notification
    </button>
  </div>
</template>
