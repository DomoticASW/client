<template>
  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-sm grid grid-cols-2 px-4">
        <template v-if="moveInstruction != undefined">
          <button class="btn btn-xs btn-shadow fa-solid fa-angle-up w-10 col-end-1" @click="moveInstruction(instruction, 'up')"></button>
          <button class="btn btn-xs btn-shadow fa-solid fa-angle-down w-10 row-start-2" @click="moveInstruction(instruction, 'down')"></button>
        </template>
        <p class="truncate">Send notification to</p>
        <p class="font-bold justify-self-center truncate">{{ instruction.email }}</p>

        <fieldset class="fieldset w-full justify-self-center col-span-2">
          <legend class="fieldset-legend">Message sent</legend>
          <textarea placeholder="Message sent" class="w-full textarea" disabled :value=instruction.message />
        </fieldset>
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
