<script setup lang="ts">
  import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
  import { instructions } from '@/components/tasks-automations/example';
  import Trigger from '@/components/tasks-automations/Trigger.vue';
</script>

<template>
  <div class="mx-6">
    <!-- TODO: put name and not id (finding the automation from the server) -->
    <input type="text" placeholder="Automation name" class="input w-full" :value="$route.params.id !== undefined ? $route.params.id : ''"/>
  </div>
  <hr class="m-4" />
  <h1 class="text-xl">Trigger</h1>
  <div class="grid grid-cols-2 p-4 justify-items-center" v-if="$route.params.id === undefined">
    <button class="btn btn-neutral w-50" type="button">Device Event</button>
    <button class="btn btn-neutral w-50" type="button">Period</button>
  </div>
  <Trigger v-if="$route.params.id !== undefined"/>
  <hr class="m-4">
  <h1 class="text-xl">Actions</h1>
  <!-- instructions need to be taken from the server when loading the page, if adding a new automation it is not needed (v-if already doing it) -->
  <InstructionReorder :instructions="instructions" v-if="$route.params.id !== undefined"/>
  <div class="pb-4"></div>
</template>
