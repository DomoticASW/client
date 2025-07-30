<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p class="truncate">{{ instruction.deviceId }}</p> <!-- To get name of the device -->
    <p class="font-bold text-center truncate">{{ instruction.name }}</p>
    <p class="text-xs truncate">{{ instruction.devicePropertyId }}</p> <!-- To get the name of the property -->
    <p class="text-center truncate"></p> <!-- Value to get from the server, maybe with socket io -->
  </InstructionLayout>
</template>

<script setup lang="ts">
import type {
  CreateDevicePropertyConstantInstruction,
  Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue';

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit?: {
    moveInstruction: (instr: Instruction, dir: 'up' | 'down') => void
    removeInstruction: (instr: Instruction) => void
  }
}>()

const instruction = ref(props.instruction.instruction as CreateDevicePropertyConstantInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as CreateDevicePropertyConstantInstruction
  },
  { immediate: true },
)

</script>
