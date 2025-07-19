<template>
  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-base grid grid-cols-2 px-4">
        <template v-if="moveInstruction !== undefined">
          <button class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1" @click="moveInstruction(instruction, 'up')"></button>
          <button class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2" @click="moveInstruction(instruction, 'down')"></button>
        </template>
        <p class="truncate">Send notification to</p>
        <p class="font-bold text-center truncate">{{ instruction.email }}</p>

        <label class="label mb-2 text-secondary-content col-span-2">Message sent</label>
        <div class="row-start-3 col-span-full">
          <textarea placeholder="Message sent" class="w-full textarea " :disabled="moveInstruction === undefined" :value=instruction.message />
        </div>
        <template v-if="moveInstruction !== undefined">
          <button class="btn btn-square fa-solid fa-xmark row-start-1 col-start-3 row-span-2 place-self-center"></button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Instruction, SendNotificationInstruction } from './types.js'

defineProps<{
  instruction: SendNotificationInstruction,
  indent: string,
  depth: number,
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
}>()
</script>
