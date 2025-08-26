<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import { useGroupsStore } from '@/stores/groups'
import { computed } from 'vue'

const props = defineProps<{
  id: string
  device: Device
}>()

const deviceGroups = computed(() =>
  useGroupsStore().groups.filter((g) => g.devices.map((d) => d.id).includes(props.device.id)),
)

function openGroupsDialog() {
  const dialog = document.getElementById(props.id.toString() + '_groups') as HTMLDialogElement
  dialog.showModal()
}

function groupsToString() {
  return (
    deviceGroups.value[0].name +
    (deviceGroups.value.length > 1
      ? ', ' + deviceGroups.value[1].name + (deviceGroups.value.length > 2 ? ', ...' : '')
      : '')
  )
}
</script>

<template>
  <span class="grid grid-cols-1 sm:grid-cols-7 gap-1">
    <span class="sm:col-span-3"> {{ device.name }}</span>
    <button
      v-if="deviceGroups.length > 0"
      class="btn btn-ghost bg-base-100 btn-xs sm:col-span-4"
      @click.stop="openGroupsDialog"
    >
      {{ groupsToString() }}
    </button>
  </span>
</template>
