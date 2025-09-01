<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import DeviceGroupsButton from './DeviceGroupsButton.vue'
import { useGroupsStore } from '@/stores/groups';

defineProps<{
  id: string
  device: Device
}>()
</script>

<template>
  <span class="grid grid-cols-1 sm:grid-cols-7 gap-1">
    <span :class="useGroupsStore().getGroupsOfDevice(device.id).length === 0 ? 'col-span-full' : 'sm:col-span-3'"> {{ device.name }}</span>
    <DeviceGroupsButton :id="id" :device="device" class="sm:col-span-4" />
  </span>
</template>
