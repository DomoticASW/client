<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({ id: { type: String, required: true } })

interface Device {
  id: string
  name: string
}
interface DeviceGroup {
  id: string
  name: string
  devices: Device[]
}

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
)

const devicesNotInGroup = computed(() => {
  if (group.value && devices.value)
    return devices.value.filter(
      (d) => group.value!.devices.find((d2) => d.id == d2.id) == undefined,
    )
  else return undefined
})
// const successAlertId = 'success_alert_id'
// const successAlert = () => document.getElementById(successAlertId)!
// function addDevice(id: string) {
//   devices.value = devices.value.filter((d) => d.id != id)
//   successAlert().classList.remove('opacity-0')
//   setTimeout(() => successAlert().classList.add('opacity-0'), 2000)
// }
</script>

<template>
  <div>
    <div class="navbar flex justify-between">
      <h1 class="text-2xl">{{ group?.name }}</h1>
      <button class="btn btn-ghost text-error">Delete</button>
    </div>
    <ul class="list">
      <li v-for="d in group?.devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button class="btn btn-ghost fa-solid fa-remove"></button>
      </li>
    </ul>

    <div class="divider"></div>

    <h2 class="text-xl">Devices not in group</h2>
    <ul class="list">
      <li v-for="d in devicesNotInGroup" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button class="btn btn-ghost fa-solid fa-add"></button>
      </li>
    </ul>
    <!-- <div
      :id="successAlertId"
      role="alert"
      class="alert alert-success fixed bottom-1 inset-x-1 opacity-0 transition-all duration-300"
    >
      <span class="fa-solid fa-circle-check fa-xl"></span>
      Device added!
    </div> -->
  </div>
</template>

<style></style>
