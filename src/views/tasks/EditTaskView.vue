<script setup lang="ts">
  import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
  import { instructions } from '@/components/tasks-automations/example';
</script>

<template>
  <fieldset class="fieldset mx-6">
    <legend class="fieldset-legend text-base">Task name</legend>
    <input type="text" placeholder="Task name" class="input w-full" :value="$route.params.id"/> <!-- TODO: put name and not id (finding the task from the server) -->
  </fieldset>
  <hr class="m-4" />
  <InstructionReorder :instructions="instructions"/>
  <div class="pb-4"></div>
</template>
