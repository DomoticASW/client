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
        <template v-if="edit">
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1"
            @click="edit.moveInstruction(props.instruction, 'up')"
          ></button>
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2"
            @click="edit.moveInstruction(props.instruction, 'down')"
          ></button>
        </template>
        <slot></slot>
        <template v-if="edit !== undefined">
          <button
            class="btn btn-square fa-solid fa-xmark row-start-1 place-self-center row-span-2"
            :class="
              instruction.type === InstructionType.IfInstruction ||
              instruction.type === InstructionType.IfElseInstruction
                ? 'ml-4 col-start-6'
                : 'col-start-3'
            "
            @click="edit.removeInstruction(props.instruction)"
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
  edit?: {
    moveInstruction: (instr: Instruction, dir: 'up' | 'down') => void
    removeInstruction: (instr: Instruction) => void
  }
}>()
</script>
