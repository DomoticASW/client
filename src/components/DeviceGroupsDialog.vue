<script setup lang="ts">
import type { Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'

defineProps<{
  id: string
  device?: Device
  deviceGroups: DeviceGroup[]
}>()
</script>

<template>
  <dialog :id="id + '_groups'" class="modal modal-sm">
    <div class="modal-box max-w-sm" v-if="device">
      <h3 class="card-title mb-2">{{ device.name }} groups</h3>
      <p>The {{ device.name }} is in these groups right now:</p>
      <p class="font-bold" v-for="group in deviceGroups" :key="group.id">- {{ group.name }}</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>
</template>
