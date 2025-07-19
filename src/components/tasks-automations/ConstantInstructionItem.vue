<template>
  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-base grid grid-cols-2 px-4">
        <template v-if="moveInstruction !== undefined">
          <button class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1" @click="moveInstruction(instruction, 'up')"></button>
          <button class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2" @click="moveInstruction(instruction, 'down')"></button>
        </template>
        <p>Constant</p>
        <p class="font-bold truncate text-center">{{ instruction.name }}</p>
        <p class="col-start-2 truncate text-center"> {{ instruction.value }} </p>
        <template v-if="moveInstruction !== undefined">
          <button class="btn btn-square fa-solid fa-xmark row-start-1 col-start-3 row-span-2 place-self-center"></button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConstantInstruction, Instruction } from './types.js'

defineProps<{
  instruction: ConstantInstruction,
  indent: string,
  depth: number,
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
}>()
</script>
