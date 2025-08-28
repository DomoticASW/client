<template>
  <NavbarLayout :title="user.nickname" :show-back-button="true">
    <div class="px-4">
      <h2 class="text-2xl font-bold dark:text-white">Can use these devices</h2>
      <div>
        <ul class="list rounded-box" v-if="devicesWithPermissions">
          <li class="list-row" v-for="device in devicesWithPermissions" :key="device.id">
            <span class="fa-solid fa-microchip text-2xl self-center"></span>
            <div>
              {{ device.name }}
              <DeviceGroupsButton :id="device.id" :device="device" />
              <br />
              <span class="text-xs ml-1 opacity-60">id: {{ device.id }}</span>
            </div>
            <button
              class="btn btn-circle btn-ghost fa-solid fa-xmark"
              type="button"
              :aria-label="'Remove permission on: ' + device.name"
              @click="removeUserDevicePermission(device.id)"
            ></button>
            <DeviceGroupsDialog :id="device.id" :device="device" />
          </li>
        </ul>
        <DeviceListSkeleton v-else />
      </div>
      <hr class="my-4 border-gray-300" />
      <h2 class="text-2xl font-bold dark:text-white">Cannot use these devices</h2>
      <div>
        <ul class="list rounded-box" v-if="devicesWithoutPermissions">
          <li class="list-row" v-for="device in devicesWithoutPermissions" :key="device.id">
            <span class="fa-solid fa-microchip text-2xl self-center"></span>
            <div>
              {{ device.name }}
              <DeviceGroupsButton :id="device.id" :device="device" />
              <br />
              <span class="text-xs ml-1 opacity-60">id: {{ device.id }}</span>
            </div>
            <button
              class="btn btn-circle btn-ghost fa-solid fa-plus"
              type="button"
              :aria-label="'Add permission of: ' + device"
              @click="addUserDevicePermission(device.id)"
            ></button>
            <DeviceGroupsDialog :id="device.id" :device="device" />
          </li>
        </ul>
        <DeviceListSkeleton v-else />
      </div>
    </div>
  </NavbarLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserInfoStore } from '@/stores/user-info'
import type { Device, DeviceId } from '@/model/devices-management/Device'
import * as devicesApi from '@/api/devices-management/requests/devices'
import * as api from '@/api/permission-management/requests/permissions'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import router from '@/router'
import { useRoute } from 'vue-router'
import NavbarLayout from '@/components/NavbarLayout.vue'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import DeviceGroupsButton from '@/components/DeviceGroupsButton.vue'
import DeviceGroupsDialog from '@/components/DeviceGroupsDialog.vue'

const loadingOverlay = useLoadingOverlayStore()
const devicesWithPermissions = ref<Device[] | undefined>(undefined)
const devicesWithoutPermissions = ref<Device[] | undefined>(undefined)

const userInfoStore = useUserInfoStore()
const adminToken = userInfoStore.token

const route = useRoute()
const user = {
  nickname: history.state?.nickname,
  email: route.params.id as string,
}

const loadDevices = async () => {
  const userDevicePermissions = await api.getUserDevicesPermissions(user.email, adminToken)
  const permittedDeviceIds = userDevicePermissions.map((permission) => permission.deviceId)
  const allDevices = await devicesApi.getAllDevices(adminToken)
  devicesWithPermissions.value = allDevices.filter((device: Device) =>
    permittedDeviceIds.includes(device.id),
  )
  devicesWithoutPermissions.value = allDevices.filter(
    (device: Device) => !permittedDeviceIds.includes(device.id),
  )
}

const addUserDevicePermission = async (deviceId: DeviceId) => {
  try {
    loadingOverlay.startLoading()
    await api.setUserDevicePermission(user.email, deviceId, adminToken)
    if (devicesWithoutPermissions.value && devicesWithPermissions.value) {
      const deviceIndex = devicesWithoutPermissions.value.findIndex(
        (device) => device.id === deviceId,
      )
      if (deviceIndex !== -1) {
        const [movedDevice] = devicesWithoutPermissions.value.splice(deviceIndex, 1)
        devicesWithPermissions.value.push(movedDevice)
      }
    }
  } finally {
    loadingOverlay.stopLoading()
  }
}

const removeUserDevicePermission = async (deviceId: DeviceId) => {
  try {
    loadingOverlay.startLoading()
    await api.deleteUserDevicePermission(user.email, deviceId, adminToken)
    if (devicesWithPermissions.value && devicesWithoutPermissions.value) {
      const deviceIndex = devicesWithPermissions.value.findIndex((device) => device.id === deviceId)
      if (deviceIndex !== -1) {
        const [removedDevice] = devicesWithPermissions.value.splice(deviceIndex, 1)
        devicesWithoutPermissions.value.push(removedDevice)
      }
    }
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(() => {
  if (!user.email || !user.nickname) {
    router.back()
    throw new Error('This user does not exist!')
  }
  loadDevices()
})
</script>
