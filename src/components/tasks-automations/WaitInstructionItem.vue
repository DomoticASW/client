<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p>Wait</p>
    <p class="font-bold truncate text-center">{{ formatDuration(instruction.seconds) }}</p>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, WaitInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue';
import { formatDuration } from '@/model/scripts/Script';

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const instruction = ref(props.instruction.instruction as WaitInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as WaitInstruction
  },
  { immediate: true },
)

</script>
