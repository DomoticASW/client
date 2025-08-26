import { getAllDeviceGroups } from "@/api/devices-management/requests/device-groups";
import type { DeviceGroup } from "@/model/devices-management/DeviceGroup";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserInfoStore } from "./user-info";
import type { DeviceId } from "@/model/devices-management/Device";
import { useLoadingOverlayStore } from "./loading-overlay";

export const useGroupsStore = defineStore('groups', () => {
  const userInfo = useUserInfoStore()
  const groups = ref<DeviceGroup[]>([])

  async function updateGroups() {
    const loadingOverlay = useLoadingOverlayStore()
    if (userInfo.token) {
      try {
        loadingOverlay.startLoading()
        console.log("qui")
        groups.value = await getAllDeviceGroups(userInfo.token)
      } finally {
        loadingOverlay.stopLoading()
      }
    }
  }

  function deviceGroups(deviceId: DeviceId) {
    return groups.value.filter((g) =>
      g.devices.map((d) => d.id).includes(deviceId),
    )
  }

  function getDeviceFromGroups(deviceId: DeviceId) {
    return deviceGroups(deviceId)[0].devices.find(
      (d) => d.id === deviceId,
    )!
  }

  return { groups, updateGroups, deviceGroups, getDeviceFromGroups }
})
