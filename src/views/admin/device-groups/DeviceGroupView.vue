<script setup lang="ts">
import router from '@/router'
import { computed, onMounted, ref } from 'vue'
import DeviceRowSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import { DeviceGroupId } from '@/model/devices-management/DeviceGroup'
import type { Device, DeviceId } from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { useGroupsStore } from '@/stores/groups'
import * as api from '@/api/devices-management/requests/device-groups'
import * as devicesApi from '@/api/devices-management/requests/devices'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import NavbarLayout from '@/components/NavbarLayout.vue'
import DeviceGroupsButton from '@/components/DeviceGroupsButton.vue'
import DeviceGroupsDialog from '@/components/DeviceGroupsDialog.vue'

const props = defineProps({ id: { type: String, required: true } })
const groupId = DeviceGroupId(props.id)
const userInfo = useUserInfoStore()
const groupsStore = useGroupsStore()
const loadingOverlay = useLoadingOverlayStore()
const successPresenter = useSuccessPresenterStore()

const devices = ref<Device[] | undefined>(undefined)

const group = computed(() => groupsStore.groups.find((g) => g.id === groupId))

const devicesNotInGroup = computed(() => {
  if (group.value && devices.value)
    return devices.value.filter(
      (d) => group.value!.devices.find((d2) => d.id == d2.id) == undefined,
    )
  else return undefined
})
async function removeDeviceFromGroup(deviceId: DeviceId) {
  try {
    loadingOverlay.startLoading()
    await api.removeDeviceFromDeviceGroup(groupId, deviceId, userInfo.token)
    group.value!.devices = group.value!.devices.filter((d) => d.id != deviceId)
    const deviceName = devices.value?.find((d) => d.id == deviceId)?.name ?? 'Device'
    const groupName = group.value?.name ?? 'group'
    successPresenter.showSuccess(presentSuccess(`${deviceName} removed from ${groupName}!`))
  } finally {
    loadingOverlay.stopLoading()
  }
}
async function addDeviceToGroup(deviceId: DeviceId) {
  try {
    loadingOverlay.startLoading()
    await api.addDeviceToDeviceGroup(groupId, deviceId, userInfo.token)
    const device = devices.value!.find((d) => d.id == deviceId)
    const deviceName = devices.value?.find((d) => d.id == deviceId)?.name ?? 'Device'
    const groupName = group.value?.name ?? 'group'
    successPresenter.showSuccess(presentSuccess(`${deviceName} added to ${groupName}!`))
    if (device) {
      group.value!.devices.push(device)
    }
  } finally {
    loadingOverlay.stopLoading()
  }
}
async function deleteGroup() {
  try {
    loadingOverlay.startLoading()
    await api.deleteDeviceGroup(groupId, userInfo.token)
    const groupName = group.value?.name ?? ''
    successPresenter.showSuccess(presentSuccess(`Group ${groupName} deleted!`))
    router.back()
  } finally {
    loadingOverlay.stopLoading()
  }
}

onMounted(async () => {
  groupsStore.updateGroups()
})
onMounted(async () => {
  devices.value = await devicesApi.getAllDevices(userInfo.token)
})
</script>

<template>
  <NavbarLayout :title="group?.name" :showBackButton="true">
    <template v-slot:actions>
      <button class="btn btn-ghost text-error" @click="deleteGroup">Delete</button>
    </template>
    <ul v-if="group" class="list">
      <li v-for="d in group.devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <DeviceGroupsButton :id="d.id" :device="d" />
          <br />
          <span class="text-xs ml-1 opacity-60">id: {{ d.id }}</span>
        </div>
        <button
          class="btn btn-circle btn-ghost fa-solid fa-remove"
          @click="removeDeviceFromGroup(d.id)"
        ></button>
        <DeviceGroupsDialog :id="d.id" :device="d" />
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
          <DeviceGroupsButton :id="d.id" :device="d" />
          <br />
          <span class="text-xs ml-1 opacity-60">id: {{ d.id }}</span>
        </div>
        <button
          class="btn btn-circle btn-ghost fa-solid fa-add"
          @click="addDeviceToGroup(d.id)"
        ></button>
        <DeviceGroupsDialog :id="d.id" :device="d" />
      </li>
    </ul>
    <DeviceRowSkeleton v-else :nRows="5" />
  </NavbarLayout>
</template>

<style></style>
