<script setup lang="ts">
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { Device, DeviceId } from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import * as api from '@/api/devices-management/requests/devices'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const devices = ref<Device[] | undefined>()

async function removeDevice(id: DeviceId) {
  try {
    loadingOverlay.startLoading()
    await api.deleteDevice(id, userInfo.token)
    devices.value = devices.value?.filter((d) => d.id != id)
  } finally {
    loadingOverlay.stopLoading()
  }
}

const deviceEditing = ref<DeviceId | undefined>(undefined)
const deviceEditingName = ref<string | undefined>(undefined)

const editDeviceNameModal = useTemplateRef('edit_device_name_modal')
function startEditingDevice(id: DeviceId) {
  const device = devices.value!.find((d) => d.id == id)!
  deviceEditing.value = device.id
  deviceEditingName.value = device.name
  editDeviceNameModal.value?.showModal()
}
function cancelEditingDevice() {
  deviceEditing.value = undefined
  deviceEditingName.value = undefined
  editDeviceNameModal.value?.close()
}
async function saveEditingDevice() {
  const id = deviceEditing.value
  const newName = deviceEditingName.value
  if (devices.value && id && newName != undefined) {
    try {
      loadingOverlay.startLoading()
      await api.renameDevice(id, newName, userInfo.token)
      const device = devices.value.find((g) => g.id === id)
      if (device) {
        device.name = newName
      }
    } finally {
      cancelEditingDevice()
      loadingOverlay.stopLoading()
    }
  }
  cancelEditingDevice()
}

onMounted(async () => {
  devices.value = await api.getAllDevices(userInfo.token)
})
</script>

<template>
  <div>
    <div class="navbar justify-between">
      <h1 class="text-2xl">Manage devices</h1>
      <RouterLink :to="{ name: 'add-device' }">
        <a class="btn btn-ghost fa-solid fa-plus fa-lg !flex"></a>
      </RouterLink>
    </div>
    <ul v-if="devices" class="list">
      <li v-for="d in devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button
          class="btn btn-ghost fa-solid fa-pen"
          v-on:click="startEditingDevice(d.id)"
        ></button>
        <button class="btn btn-ghost fa-solid fa-trash" v-on:click="removeDevice(d.id)"></button>
      </li>
    </ul>
    <DeviceListSkeleton v-else />

    <!-- Dialog for changing a device name -->
    <dialog ref="edit_device_name_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Change the device name</h3>
        <input type="text" placeholder="Device name" class="input" v-model="deviceEditingName" />
        <div class="modal-action">
          <button class="btn btn-primary" v-on:click="saveEditingDevice()">Save</button>
          <button class="btn btn-primary btn-soft" v-on:click="cancelEditingDevice()">
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style></style>
