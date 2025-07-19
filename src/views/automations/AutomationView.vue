<script setup lang="ts">
  import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
  import { instructions } from '@/components/tasks-automations/example';
  import Trigger from '@/components/tasks-automations/Trigger.vue';
</script>

<template>
  <h1 class="text-xl">Trigger</h1>
  <Trigger />
  <hr class="m-4">
  <h1 class="text-xl">Actions</h1>
  <InstructionItem
    v-for="[key, instruction] in instructions.entries()"
    :key="key"
    :instruction="instruction"
  />
  <div class="pb-4"></div>
</template>

