<script setup lang="ts">
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { Device, DeviceId } from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref, useTemplateRef } from 'vue'
import * as api from '@/api/devices-management/requests/devices'
import { useErrorPresenterStore } from '@/stores/error-presenter'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import AddButton from '@/components/AddButton.vue'
import NavbarLayout from '@/components/NavbarLayout.vue'
import DeviceGroupsButton from '@/components/DeviceGroupsButton.vue'
import DeviceGroupsDialog from '@/components/DeviceGroupsDialog.vue'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const errorPresenter = useErrorPresenterStore()
const successPresenter = useSuccessPresenterStore()
const devices = ref<Device[] | undefined>()

async function removeDevice(id: DeviceId) {
  try {
    loadingOverlay.startLoading()
    await api.deleteDevice(id, userInfo.token)
    devices.value = devices.value?.filter((d) => d.id != id)
    successPresenter.showSuccess(presentSuccess(`Device removed!`))
  } finally {
    loadingOverlay.stopLoading()
  }
}

const deviceEditing = ref<DeviceId | undefined>(undefined)
const deviceEditingName = ref<string | undefined>(undefined)

const editDeviceNameModal = useTemplateRef('edit-device-name-modal')
function startEditingDevice(id: DeviceId) {
  const device = devices.value!.find((d) => d.id == id)!
  deviceEditing.value = device.id
  deviceEditingName.value = device.name
  editDeviceNameModal.value?.showModal()
}
async function saveEditingDevice() {
  const id = deviceEditing.value
  const newName = deviceEditingName.value
  editDeviceNameModal.value?.close()
  if (devices.value && id && newName != undefined) {
    try {
      loadingOverlay.startLoading()
      await api.renameDevice(id, newName, userInfo.token)
      const device = devices.value.find((g) => g.id === id)
      if (device) {
        device.name = newName
        successPresenter.showSuccess(presentSuccess(`Device renamed!`))
      }
    } catch (e) {
      if (typeof e == 'object' && e != null)
        errorPresenter.showError(e, () => editDeviceNameModal.value!.showModal())
    } finally {
      loadingOverlay.stopLoading()
    }
  }
}

onMounted(async () => {
  devices.value = await api.getAllDevices(userInfo.token)
})
</script>

<template>
  <div>
    <NavbarLayout title="Manage devices">
      <ul v-if="devices" class="list">
        <li v-for="d in devices" v-bind:key="d.id" class="list-row">
          <span class="fa-solid fa-microchip text-2xl self-center"></span>
          <div>
            {{ d.name }}
            <DeviceGroupsButton :id="d.id" :device="d" />
            <br />
            <span class="text-xs ml-1 opacity-60">id: {{ d.id }}</span>
          </div>
          <button
            class="btn btn-circle btn-ghost fa-solid fa-pen"
            v-on:click="startEditingDevice(d.id)"
          ></button>
          <button
            class="btn btn-circle btn-ghost fa-solid fa-trash"
            v-on:click="removeDevice(d.id)"
          ></button>
          <DeviceGroupsDialog :id="d.id" :device="d" />
        </li>
      </ul>
      <DeviceListSkeleton v-else />
      <AddButton name="add-device" />
    </NavbarLayout>

    <!-- Dialog for changing a device name -->
    <dialog ref="edit-device-name-modal" class="modal modal-middle">
      <div class="modal-box max-w-sm">
        <h3 class="card-title mb-2 mx-auto justify-center">Change the device name</h3>
        <input
          type="text"
          placeholder="Device name"
          class="input w-full"
          v-model="deviceEditingName"
        />
        <div class="modal-action">
          <button class="btn btn-primary" v-on:click="saveEditingDevice()">Save</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="editDeviceNameModal?.close()">Cancel</button>
      </form>
    </dialog>
  </div>
</template>

<style></style>
