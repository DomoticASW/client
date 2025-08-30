import { getAllDeviceGroups } from "@/api/devices-management/requests/device-groups";
import type { DeviceGroup } from "@/model/devices-management/DeviceGroup";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserInfoStore } from "./user-info";
import { type DeviceId } from "@/model/devices-management/Device";

export const useGroupsStore = defineStore('groups', () => {
  const userInfo = useUserInfoStore()
  const groups = ref<DeviceGroup[]>([])
  const selectedGroups = ref<DeviceGroup[]>([])
  const selectedDevice = ref<DeviceId>()

  async function updateGroups() {
    groups.value = await getAllDeviceGroups(userInfo.token)
  }

  function deviceGroups(deviceId: DeviceId, show: boolean = false) {
    selectedGroups.value = groups.value.filter((g) =>
      g.devices.map(d => d.id).includes(deviceId)
    )
    if (show) {
      selectedDevice.value = deviceId
    }
    return selectedGroups.value
  }

  function findDevice(deviceId: DeviceId) {
    return groups.value.filter((g) =>
      g.devices.map(d => d.id).includes(deviceId)
    )[0].devices.find(
      (d) => d.id === deviceId,
    )!
  }

  function resetSelectedDevice() {
    selectedDevice.value = undefined
  }

  return { groups, selectedGroups, selectedDevice, updateGroups, deviceGroups, findDevice, resetSelectedDevice }
})
