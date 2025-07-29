<template>
  <IfInstructionItem
    v-if="
      instruction.type === InstructionType.IfInstruction ||
      instruction.type === InstructionType.IfElseInstruction
    "
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
  <ConstantInstructionItem
    v-else-if="instruction.type === InstructionType.CreateConstantInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
  <CreateDevicePropertyConstantInstructionItem
    v-else-if="instruction.type === InstructionType.CreateDevicePropertyConstantInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
  <DeviceActionInstructionItem
    v-else-if="instruction.type === InstructionType.DeviceActionInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
  <SendNotificationInstructionItem
    v-else-if="instruction.type === InstructionType.SendNotificationInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
  <WaitInstructionItem
    v-else-if="instruction.type === InstructionType.WaitInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
  <StartTaskInstructionItem
    v-else-if="instruction.type === InstructionType.StartTaskInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
</template>

<script setup lang="ts">
import IfInstructionItem from '@/components/tasks-automations/IfInstructionItem.vue'

import ConstantInstructionItem from '@/components/tasks-automations/ConstantInstructionItem.vue'
import CreateDevicePropertyConstantInstructionItem from '@/components/tasks-automations/CreateDevicePropertyConstantInstructionItem.vue'

import DeviceActionInstructionItem from '@/components/tasks-automations/DeviceActionInstructionItem.vue'
import SendNotificationInstructionItem from '@/components/tasks-automations/SendNotificationInstructionItem.vue'
import { InstructionType, type Instruction } from '@/model/scripts/Instruction'
import WaitInstructionItem from './WaitInstructionItem.vue'
import StartTaskInstructionItem from './StartTaskInstructionItem.vue'

const props = defineProps<{
  instruction: Instruction
  depth?: number // Depth for indentation
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
  removeInstruction?: (instr: Instruction) => void
}>()

const depthLevel = props.depth ?? 0
const colors =
  depthLevel % 2 == 0
    ? 'bg-secondary/70 text-secondary-content'
    : 'bg-secondary/70 text-secondary-content'
const marginByDepth = ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-16', 'ml-20', 'ml-24']

const indentClass = marginByDepth[depthLevel]
</script>
