<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import DeviceGroupsButton from './DeviceGroupsButton.vue'

defineProps<{
  id: string
  device: Device
}>()
</script>

<template>
  <span class="grid grid-cols-1 sm:grid-cols-7 gap-1">
    <span class="sm:col-span-3"> {{ device.name }}</span>
    <DeviceGroupsButton :id="id" :device="device" class="sm:col-span-4" />
  </span>
</template>
