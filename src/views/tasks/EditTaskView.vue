<script setup lang="ts">
import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
import { instructions } from '@/components/tasks-automations/example'
</script>

<template>
  <div class="mx-6">
    <!-- TODO: put name and not id (finding the task from the server) -->
    <input
      type="text"
      placeholder="Task name"
      class="input w-full"
      :value="$route.params.id != undefined ? $route.params.id : ''"
    />
  </div>
  <hr class="m-4" />
  <!-- instructions need to be taken from the server when loading the page, if adding a new task it is not needed (v-if not needed) -->
  <InstructionReorder :instructions="instructions" v-if="$route.params.id != undefined" />
  <div class="pb-4"></div>
</template>
