import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useGroupsStore } from "./groups"
import type { DeviceId } from "@/model/devices-management/Device"

export const useGroupsDialogStore = defineStore('groups-dialog', () => {
  const selectedDeviceGroups = computed(() => selectedDevice.value ? useGroupsStore().getGroupsOfDevice(selectedDevice.value!) : [])
  const selectedDevice = ref<DeviceId>()

  function showDeviceGroups(deviceId: DeviceId) {
    selectedDevice.value = deviceId
  }

  function closeDialog() {
    selectedDevice.value = undefined
  }

  return { selectedDeviceGroups, selectedDevice, showDeviceGroups, closeDialog }
})
