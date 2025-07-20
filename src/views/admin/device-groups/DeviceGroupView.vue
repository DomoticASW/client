<script setup lang="ts">
import router from '@/router'
import { computed, ref } from 'vue'
import DeviceRowSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import type { Device } from '@/model/devices-management/Device'

const props = defineProps({ id: { type: String, required: true } })

const group = ref<DeviceGroup | undefined>(undefined)
// TODO: call the sever
setTimeout(
  () =>
    (group.value = {
      id: props.id,
      name: 'Kitchen',
      devices: [
        { id: '1', name: 'Roomba' },
        { id: '2', name: 'Thermometer' },
        { id: '3', name: 'Lamp' },
      ],
    }),
  1000,
)

const devices = ref<Device[] | undefined>(undefined)
setTimeout(
  () =>
    (devices.value = [
      { id: '1', name: 'Roomba' },
      { id: '2', name: 'Thermometer' },
      { id: '3', name: 'Lamp' },
      { id: '4', name: 'Lamp2' },
      { id: '5', name: 'Lamp3' },
      { id: '6', name: 'Lamp4' },
      { id: '7', name: 'Lamp5' },
      { id: '8', name: 'Lamp6' },
      { id: '9', name: 'Lamp7' },
    ]),
  1500,
)

const devicesNotInGroup = computed(() => {
  if (group.value && devices.value)
    return devices.value.filter(
      (d) => group.value!.devices.find((d2) => d.id == d2.id) == undefined,
    )
  else return undefined
})
function removeDeviceFromGroup(deviceId: string) {
  group.value!.devices = group.value!.devices.filter((d) => d.id != deviceId)
}
function addDeviceToGroup(deviceId: string) {
  const device = devices.value!.find((d) => d.id == deviceId)
  if (device) {
    group.value!.devices.push(device)
  }
}
function deleteGroup() {
  // TODO: delete group
  router.back()
}
</script>

<template>
  <div class="navbar flex justify-between">
    <h1 class="text-2xl" :class="{ 'skeleton h-4 w-1/2': !group }">{{ group?.name }}</h1>
    <button class="btn btn-ghost text-error" @click="deleteGroup">Delete</button>
  </div>
  <ul v-if="group" class="list">
    <li v-for="d in group.devices" v-bind:key="d.id" class="list-row">
      <span class="fa-solid fa-microchip text-2xl self-center"></span>
      <div>
        {{ d.name }}
        <br />
        <span class="text-xs">id: {{ d.id }}</span>
      </div>
      <button
        class="btn btn-ghost fa-solid fa-remove"
        @click="removeDeviceFromGroup(d.id)"
      ></button>
    </li>
  </ul>
  <DeviceRowSkeleton v-else />

  <div class="divider"></div>

  <h2 v-if="devices" class="text-xl">Devices not in group</h2>
  <div v-else class="skeleton h-4 w-1/2"></div>

  <ul v-if="devices" class="list">
    <li v-for="d in devicesNotInGroup" v-bind:key="d.id" class="list-row">
      <span class="fa-solid fa-microchip text-2xl self-center"></span>
      <div>
        {{ d.name }}
        <br />
        <span class="text-xs">id: {{ d.id }}</span>
      </div>
      <button class="btn btn-ghost fa-solid fa-add" @click="addDeviceToGroup(d.id)"></button>
    </li>
  </ul>
  <DeviceRowSkeleton v-else :nRows="5" />
</template>

<style></style>
