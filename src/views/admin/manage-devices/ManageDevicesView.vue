<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const devices = ref([
  { id: '1', name: 'Roomba' },
  { id: '1', name: 'Roomba' },
  { id: '1', name: 'Roomba' },
  { id: '1', name: 'Roomba' },
  { id: '1', name: 'Roomba' },
  { id: '2', name: 'Thermometer' },
  { id: '3', name: 'Lamp' },
  { id: '2', name: 'Thermometer' },
  { id: '3', name: 'Lamp' },
  { id: '2', name: 'Thermometer' },
  { id: '3', name: 'Lamp' },
  { id: '2', name: 'Thermometer' },
  { id: '3', name: 'Lamp' },
  { id: '2', name: 'Thermometer' },
  { id: '3', name: 'Lamp' },
])
</script>

<template>
  <div>
    <div class="navbar justify-between">
      <h1 class="text-2xl">Manage devices</h1>
      <RouterLink :to="{ name: 'add-device' }">
        <a class="btn btn-ghost fa-solid fa-plus fa-lg !flex"></a>
      </RouterLink>
    </div>
    <ul class="list">
      <li v-for="d in devices" v-bind:key="d.id" class="list-row">
        <span class="fa-solid fa-microchip text-2xl self-center"></span>
        <div>
          {{ d.name }}
          <br />
          <span class="text-xs">id: {{ d.id }}</span>
        </div>
        <button class="btn btn-ghost fa-solid fa-pen"></button>
        <button class="btn btn-ghost fa-solid fa-trash"></button>
      </li>
    </ul>
  </div>
</template>

<style></style>
