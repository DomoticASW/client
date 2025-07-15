<script setup lang="ts">
import { ref } from 'vue'

const devices = ref([
  { id: '1', name: 'Roomba' },
  { id: '2', name: 'Roomba' },
  { id: '3', name: 'Roomba' },
  { id: '4', name: 'Roomba' },
  { id: '5', name: 'Roomba' },
  { id: '6', name: 'Thermometer' },
  { id: '7', name: 'Lamp' },
  { id: '7', name: 'Thermometer' },
  { id: '8', name: 'Lamp' },
  { id: '9', name: 'Thermometer' },
  { id: '10', name: 'Lamp' },
  { id: '11', name: 'Thermometer' },
  { id: '12', name: 'Thermometer' },
  { id: '13', name: 'Lamp' },
])
const successAlertId = 'success_alert_id'
const successAlert = () => document.getElementById(successAlertId)!
function addDevice(id: string) {
  devices.value = devices.value.filter((d) => d.id != id)
  successAlert().classList.remove('opacity-0')
  setTimeout(() => successAlert().classList.add('opacity-0'), 2000)
}
</script>

<template>
  <div class="relative">
    <div class="navbar">
      <h1 class="text-2xl">Add device</h1>
    </div>
    <ul class="list">
      <li v-for="d in devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button class="btn btn-ghost fa-solid fa-plus" v-on:click="addDevice(d.id)"></button>
      </li>
    </ul>
    <div
      :id="successAlertId"
      role="alert"
      class="alert alert-success fixed bottom-1 inset-x-1 opacity-0 transition-all duration-300"
    >
      <span class="fa-solid fa-circle-check fa-xl"></span>
      Device added!
    </div>
  </div>
</template>

<style></style>
