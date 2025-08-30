<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import { useDevicesStore } from '@/stores/devices'
import { useGroupsDialogStore } from '@/stores/groups-dialog'
import { ref, useTemplateRef } from 'vue'

const deviceGroups = ref<DeviceGroup[]>()
const device = ref<Device>()
const groupDialogStore = useGroupsDialogStore()

const dialog = useTemplateRef('groups_info')

groupDialogStore.$subscribe(() => {
  if (groupDialogStore.selectedDevice) {
    device.value = useDevicesStore().getDevice(groupDialogStore.selectedDevice)
    deviceGroups.value = groupDialogStore.selectedDeviceGroups
    dialog.value?.showModal()
  }
})
</script>

<template>
  <dialog ref="groups_info" class="modal modal-sm">
    <div class="modal-box max-w-sm" v-if="device">
      <h3 class="card-title mb-2">{{ device.name }} groups</h3>
      <p>The {{ device.name }} is in these groups right now:</p>
      <p class="font-bold" v-for="group in deviceGroups" :key="group.id">- {{ group.name }}</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="groupDialogStore.closeDialog()">Ok</button>
    </form>
  </dialog>
</template>
