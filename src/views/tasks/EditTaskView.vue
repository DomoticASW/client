<script setup lang="ts">
  import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
  import { instructions } from '@/components/tasks-automations/example';
</script>

<template>
  <InstructionReorder :instructions="instructions"/>
  <div class="pb-4"></div>
</template>
