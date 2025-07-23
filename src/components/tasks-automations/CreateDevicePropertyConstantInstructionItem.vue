<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :move-instruction="moveInstruction"
    :remove-instruction="removeInstruction"
    :instruction="props.instruction"
  >
    <p class="truncate">{{ instruction.deviceId }}</p>
    <p class="font-bold text-center truncate">{{ instruction.name }}</p>
    <p class="text-xs truncate">{{ instruction.devicePropertyId }}</p>
    <p class="text-center truncate">value to get</p>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type {
  CreateDevicePropertyConstantInstruction,
  Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
  removeInstruction?: (instr: Instruction) => void
}>()

const instruction = props.instruction.instruction as CreateDevicePropertyConstantInstruction
</script>
