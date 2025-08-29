import { defineStore } from "pinia"
import { useUserInfoStore } from "./user-info"
import { ref } from "vue"
import type { Device, DeviceId } from "@/model/devices-management/Device";
import { getAllDevices } from "@/api/devices-management/requests/devices";

export const useDevicesStore = defineStore('devices', () => {
  const userInfo = useUserInfoStore()
  const devices = ref<Device[]>()

  async function updateDevices() {
    devices.value = await getAllDevices(userInfo.token)
  }

  function getDevice(deviceId: DeviceId) {
    return devices.value?.find(d => d.id === deviceId)
  }

  return { devices, updateDevices, getDevice }
});
