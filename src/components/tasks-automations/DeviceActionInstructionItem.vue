<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p class="truncate">{{ instruction.deviceId }}</p> <!-- To get name of the device -->
    <!-- <p class="font-bold text-center truncate" v-if="'values' in instruction.typeConstraints">
          Enum type constraint, to do better check
          {{ instruction.input }}
        </p> -->

    <!--<p
          :class="[
            'truncate',
            instruction.typeConstraints.type === Type.VoidType
              ? 'font-bold text-center'
              : 'text-xs',
          ]"
        >
          {{ instruction.deviceActionId }}
        </p>-->
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { DeviceActionInstruction, Instruction } from '@/model/scripts/Instruction'
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

const instruction = ref(props.instruction.instruction as DeviceActionInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as DeviceActionInstruction
  },
  { immediate: true },
)

</script>
