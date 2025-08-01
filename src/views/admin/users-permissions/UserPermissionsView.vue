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
              @click="removeUserDevicePermissions(device)"
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
              @click="addUserDevicePermissions(device)"
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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import type { Device } from '@/model/devices-management/Device';
import { authorizedRequest, deserializeBody } from '@/api/api';
import * as devicesApi from '@/api/devices-management/requests/devices'
import { arrayDeserializer } from '@/api/Deserializer';
import { userDevicePermissionDeserializer } from '@/api/permission-management/GetUseDevicePermissionDTO';

export default defineComponent({
  name: 'UsersPermissionView',
  setup() {
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
      const getUserDevicePermissionsResponse = await authorizedRequest(
        `/api/permissions/user-device-all/${user.email}`,
        adminToken,
        { method: 'GET' }
      );

      const userDevicePermissions = await deserializeBody(getUserDevicePermissionsResponse, arrayDeserializer(userDevicePermissionDeserializer));
      const permittedDeviceIds = userDevicePermissions.map(permission => permission.deviceId);
      const allDevices = await devicesApi.getAllDevices(adminToken);

      devicesWithPermissions.value = allDevices.filter((device: Device) => permittedDeviceIds.includes(device.id));
      devicesWithoutPermissions.value = allDevices.filter((device: Device) => !permittedDeviceIds.includes(device.id));
    };

    onMounted(() => {
      loadDevices();
    });

    return {
      user,
      devicesWithPermissions,
      devicesWithoutPermissions
    };
  },
  methods: {
     addUserDevicePermissions(deviceId: Device) {
      // TODO: Implement the logic to add permissions for the device
      console.log(`Adding permissions for device: ${deviceId}`)
    },

    removeUserDevicePermissions(deviceId: Device) {
      // TODO: Implement the logic to remove permissions for the device
      console.log(`Removing permissions for device: ${deviceId}`)
    }
  }
})
</script>
