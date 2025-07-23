<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :move-instruction="moveInstruction"
    :remove-instruction="removeInstruction"
    :instruction="props.instruction"
  >
    <p>Constant</p>
    <p class="font-bold truncate text-center">{{ instruction.name }}</p>
    <p class="col-start-2 truncate text-center">{{ instruction.value }}</p>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { CreateConstantInstruction, Instruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
  removeInstruction?: (instr: Instruction) => void
}>()

const instruction = props.instruction.instruction as CreateConstantInstruction
</script>
