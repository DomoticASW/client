import { getAllDeviceGroups } from "@/api/devices-management/requests/device-groups";
import type { DeviceGroup } from "@/model/devices-management/DeviceGroup";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserInfoStore } from "./user-info";
import { type DeviceId } from "@/model/devices-management/Device";

export const useGroupsStore = defineStore('groups', () => {
  const userInfo = useUserInfoStore()
  const groups = ref<DeviceGroup[]>([])

  async function updateGroups() {
    groups.value = await getAllDeviceGroups(userInfo.token)
  }

  function getGroupsOfDevice(deviceId: DeviceId) {
    return groups.value.filter((g) =>
      g.devices.map(d => d.id).includes(deviceId)
    )
  }

  function findDevice(deviceId: DeviceId) {
    return getGroupsOfDevice(deviceId)[0].devices.find(
      (d) => d.id === deviceId,
    )!
  }

  return { groups, updateGroups, getGroupsOfDevice, findDevice }
})
