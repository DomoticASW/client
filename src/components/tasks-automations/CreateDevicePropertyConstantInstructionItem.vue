<template>
<div :class="indent">
  <div :class="['card card-sm my-2', colors]">
    <div class="card-body text-base grid grid-cols-2 px-4">
      <template v-if="moveInstruction != undefined">
        <button class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1" @click="moveInstruction(instruction, 'up')"></button>
        <button class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2" @click="moveInstruction(instruction, 'down')"></button>
      </template>
      <p class="truncate">{{ instruction.deviceId }}</p>
      <p class="font-bold text-center truncate">{{ instruction.name }}</p>

      <p class="text-xs truncate">{{ instruction.devicePropertyId }}</p>
      <p class="text-center truncate">{{ instruction.value }}</p>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
import type { CreateDevicePropertyConstantInstruction, Instruction } from './types.js'

defineProps<{
  instruction: CreateDevicePropertyConstantInstruction,
  indent: string,
  depth: number,
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
}>()
</script>
