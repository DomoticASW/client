<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'

const props = defineProps<{
  device: Device
  deviceGroups: DeviceGroup[]
  openGroupsDialog: () => void
}>()

function groupsToString() {
  return (
    props.deviceGroups[0].name +
    (props.deviceGroups.length > 1
      ? ', ' + props.deviceGroups[1].name + (props.deviceGroups.length > 2 ? ', ...' : '')
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
