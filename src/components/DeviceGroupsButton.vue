<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import { useGroupsStore } from '@/stores/groups'
import { computed } from 'vue'

const props = defineProps<{
  id: string
  device: Device
}>()

const groupsStore = useGroupsStore()

const deviceGroups = computed(() =>
  groupsStore.groups.filter((g) => g.devices.map((d) => d.id).includes(props.device.id)),
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
  <button
    v-if="deviceGroups.length > 0"
    class="btn btn-soft btn-xs"
    @click.prevent.stop="openGroupsDialog"
  >
    {{ groupsToString() }}
  </button>
</template>
