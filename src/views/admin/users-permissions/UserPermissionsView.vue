<template>
  <div>
    <h1 class="text-3xl font-bold my-2">{{ user.nickname }}</h1>
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Can use these devices</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="device in devicesWithPermissions" :key="device.id">
            <div class="list-col-grow flex items-center">
              {{ device.name }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Remove permission on: ' + device.name"
              @click="removeUserDevicePermission(device.id)"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 6l12 12M6 18L18 6"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <hr class="my-4 border-gray-300" />
      <h1 class="text-2xl font-bold dark:text-white">Cannot use these devices</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="device in devicesWithoutPermissions" :key="device.id">
            <div class="list-col-grow flex items-center">
              {{ device.name }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Add permission of: ' + device"
              @click="addUserDevicePermission(device.id)"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import type { Device, DeviceId } from '@/model/devices-management/Device';
import * as devicesApi from '@/api/devices-management/requests/devices'
import * as api from '@/api/permission-management/requests/permissions';
import { useLoadingOverlayStore } from '@/stores/loading-overlay'

const loadingOverlay = useLoadingOverlayStore();
const devicesWithPermissions = ref<Device[]>([]);
const devicesWithoutPermissions = ref<Device[]>([]);

const userInfoStore = useUserInfoStore();
userInfoStore.loadFromStorage();
const adminToken = userInfoStore.token;

const user = {
  nickname: history.state?.nickname,
  email: history.state?.email
};

const loadDevices = async () => {
  const userDevicePermissions = await api.getUserDevicesPermissions(user.email, adminToken);
  const permittedDeviceIds = userDevicePermissions.map(permission => permission.deviceId);
  const allDevices = await devicesApi.getAllDevices(adminToken);
  devicesWithPermissions.value = allDevices.filter((device: Device) => permittedDeviceIds.includes(device.id));
  devicesWithoutPermissions.value = allDevices.filter((device: Device) => !permittedDeviceIds.includes(device.id));
};

const addUserDevicePermission = async (deviceId: DeviceId) => {
  try {
    loadingOverlay.startLoading();
    await api.setUserDevicePermission(user.email, deviceId, adminToken);
    const deviceIndex = devicesWithoutPermissions.value.findIndex(device => device.id === deviceId);
    if (deviceIndex !== -1) {
      const [movedDevice] = devicesWithoutPermissions.value.splice(deviceIndex, 1);
      devicesWithPermissions.value.push(movedDevice);
    }
  } finally {
    loadingOverlay.stopLoading();
  }
};

const removeUserDevicePermission = async (deviceId: DeviceId) => {
  try {
    loadingOverlay.startLoading();
    await api.deleteUserDevicePermission(user.email, deviceId, adminToken);
    const deviceIndex = devicesWithPermissions.value.findIndex(device => device.id === deviceId);
    if (deviceIndex !== -1) {
      const [removedDevice] = devicesWithPermissions.value.splice(deviceIndex, 1);
      devicesWithoutPermissions.value.push(removedDevice);
    }
  } finally {
    loadingOverlay.stopLoading();
  }
};

onMounted(() => {
  loadDevices();
});
</script>
