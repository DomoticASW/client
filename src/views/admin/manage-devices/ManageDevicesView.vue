<script setup lang="ts">
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { Device } from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { arrayDeserializer } from '@/api/Deserializer'
import { deviceDeserializer } from '@/api/devices-management/GetDeviceDTO'
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const devices = ref<Device[] | undefined>()

async function removeDevice(id: string) {
  try {
    loadingOverlay.startLoading()
    await authorizedRequest(`/api/devices/${id}`, userInfo.token, { method: 'DELETE' })
    devices.value = devices.value?.filter((d) => d.id != id)
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  } finally {
    loadingOverlay.stopLoading()
  }
}

const deviceEditing = ref<string | undefined>(undefined)
const deviceEditingName = ref<string | undefined>(undefined)

const editDeviceModalId = 'edit_device_name_modal'
const editDeviceNameModal = () => document.getElementById(editDeviceModalId) as HTMLDialogElement
function startEditingDevice(id: string) {
  const device = devices.value!.find((d) => d.id == id)!
  deviceEditing.value = device.id
  deviceEditingName.value = device.name
  editDeviceNameModal().showModal()
}
function cancelEditingDevice() {
  deviceEditing.value = undefined
  deviceEditingName.value = undefined
  editDeviceNameModal().close()
}
async function saveEditingDevice() {
  const id = deviceEditing.value
  const newName = deviceEditingName.value
  if (devices.value && id && newName != undefined) {
    try {
      loadingOverlay.startLoading()
      await authorizedRequest(`/api/devices/${id}`, userInfo.token, {
        method: 'POST',
        body: JSON.stringify({ name: newName }),
      })
      const device = devices.value.find((g) => g.id === id)
      if (device) {
        device.name = newName
      }
    } catch (e) {
      // TODO: present error to the user
      console.log(e)
    } finally {
      cancelEditingDevice()
      loadingOverlay.stopLoading()
    }
  }
  cancelEditingDevice()
}

onMounted(async () => {
  try {
    const res = await authorizedRequest('/api/devices', userInfo.token)
    devices.value = await deserializeBody(res, arrayDeserializer(deviceDeserializer))
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  }
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
    <dialog :id="editDeviceModalId" class="modal modal-bottom sm:modal-middle">
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
