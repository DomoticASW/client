<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import { useGroupsStore } from '@/stores/groups'
import { ref, useTemplateRef } from 'vue'

const deviceGroups = ref<DeviceGroup[]>()
const device = ref<Device>()
const groupsStore = useGroupsStore()

const dialog = useTemplateRef('groups_info')

groupsStore.$subscribe(() => {
  if (groupsStore.selectedDevice) {
    device.value = groupsStore.getDeviceFromGroups(groupsStore.selectedDevice)
    deviceGroups.value = groupsStore.selectedGroups
    dialog.value?.showModal()
  }
})

function resetStore() {
  groupsStore.resetSelectedDevice()
}
</script>

<template>
  <dialog ref="groups_info" class="modal modal-sm">
    <div class="modal-box max-w-sm" v-if="device">
      <h3 class="card-title mb-2">{{ device.name }} groups</h3>
      <p>The {{ device.name }} is in these groups right now:</p>
      <p class="font-bold" v-for="group in deviceGroups" :key="group.id">- {{ group.name }}</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="resetStore">Ok</button>
    </form>
  </dialog>
</template>
