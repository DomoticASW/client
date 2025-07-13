<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const devices = ref([
  { id: '1', name: 'Roomba' },
  { id: '2', name: 'Roomba' },
  { id: '3', name: 'Roomba' },
  { id: '4', name: 'Roomba' },
  { id: '5', name: 'Roomba' },
  { id: '6', name: 'Thermometer' },
  { id: '7', name: 'Lamp' },
  { id: '7', name: 'Thermometer' },
  { id: '8', name: 'Lamp' },
  { id: '9', name: 'Thermometer' },
  { id: '10', name: 'Lamp' },
  { id: '11', name: 'Thermometer' },
  { id: '12', name: 'Thermometer' },
  { id: '13', name: 'Lamp' },
])
const removeDevice = (id: string) => (devices.value = devices.value.filter((d) => d.id != id))

const deviceEditing = ref<string | undefined>(undefined)
const deviceEditingName = ref<string | undefined>(undefined)

const editDeviceModalId = 'edit_device_name_modal'
const editDeviceNameModal = () => document.getElementById(editDeviceModalId) as HTMLDialogElement
function startEditingDevice(id: string) {
  const device = devices.value.find((d) => d.id == id)!
  deviceEditing.value = device.id
  deviceEditingName.value = device.name
  editDeviceNameModal().showModal()
}
function cancelEditingDevice() {
  deviceEditing.value = undefined
  deviceEditingName.value = undefined
  editDeviceNameModal().close()
}
function saveEditingDevice() {
  devices.value.find((d) => d.id === deviceEditing.value!)!.name = deviceEditingName.value!
  cancelEditingDevice()
}
</script>

<template>
  <div>
    <div class="navbar justify-between">
      <h1 class="text-2xl">Manage devices</h1>
      <RouterLink :to="{ name: 'add-device' }">
        <a class="btn btn-ghost fa-solid fa-plus fa-lg !flex"></a>
      </RouterLink>
    </div>
    <ul class="list">
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
