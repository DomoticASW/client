<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :move-instruction="moveInstruction"
    :remove-instruction="removeInstruction"
    :instruction="props.instruction"
  >
    <p class="truncate">Send notification to</p>
    <p class="font-bold text-center truncate">{{ instruction.email }}</p>

    <label class="label mb-2 text-secondary-content col-span-2">Message sent</label>
    <div class="row-start-3 col-span-full">
      <textarea
        placeholder="Message sent"
        class="w-full textarea"
        :disabled="moveInstruction === undefined"
        :value="instruction.message"
      />
    </div>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, SendNotificationInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
  removeInstruction?: (instr: Instruction) => void
}>()

const instruction = ref(props.instruction.instruction as SendNotificationInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as SendNotificationInstruction
  },
  { immediate: true },
)
</script>
