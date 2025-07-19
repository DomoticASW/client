<script setup lang="ts">
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { instructions } from '@/components/tasks-automations/example'
</script>

<template>
  <InstructionItem
    v-for="[index, instruction] in instructions.entries()"
    :key="index"
    :instruction="instruction"
  />
  <div class="pb-4"></div>
</template>
