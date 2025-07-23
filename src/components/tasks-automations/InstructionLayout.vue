<template>
  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div
        class="card-body text-base grid px-4"
        :class="
          instruction.type === InstructionType.IfInstruction ||
          instruction.type === InstructionType.IfElseInstruction
            ? 'grid-cols-4'
            : 'grid-cols-2'
        "
      >
        <template v-if="moveInstruction !== undefined">
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1"
            @click="moveInstruction(props.instruction, 'up')"
          ></button>
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2"
            @click="moveInstruction(props.instruction, 'down')"
          ></button>
        </template>
        <slot></slot>
        <template v-if="removeInstruction !== undefined">
          <button
            class="btn btn-square fa-solid fa-xmark row-start-1 col-start-3 row-span-2 place-self-center"
            @click="removeInstruction(props.instruction)"
          ></button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InstructionType, type Instruction } from '@/model/scripts/Instruction'

const props = defineProps<{
  instruction: Instruction
  indent: string
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
  removeInstruction?: (instr: Instruction) => void
}>()
</script>
