<template>
  <IfInstructionItem
    v-if="isIfInstruction(instruction)"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
  />
  <ConstantInstructionItem
    v-else-if="isConstantInstruction(instruction)"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
  />
  <CreateDevicePropertyConstantInstructionItem
    v-else-if="isCreateDevicePropertyConstantInstruction(instruction)"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
  />
  <DeviceActionInstructionItem
    v-else-if="isDeviceActionInstruction(instruction)"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
  />
  <SendNotificationInstructionItem
    v-else-if="isSendNotificationInstruction(instruction)"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :moveInstruction="moveInstruction"
  />
</template>

<script setup lang="ts">
import {
  type Instruction,
  isConstantInstruction,
  isCreateDevicePropertyConstantInstruction,
  isDeviceActionInstruction,
  isIfInstruction,
  isSendNotificationInstruction,
} from './types.js'

import IfInstructionItem from '@/components/tasks-automations/IfInstructionItem.vue'

import ConstantInstructionItem from '@/components/tasks-automations/ConstantInstructionItem.vue'
import CreateDevicePropertyConstantInstructionItem from '@/components/tasks-automations/CreateDevicePropertyConstantInstructionItem.vue'

import DeviceActionInstructionItem from '@/components/tasks-automations/DeviceActionInstructionItem.vue'
import SendNotificationInstructionItem from '@/components/tasks-automations/SendNotificationInstructionItem.vue'

const props = defineProps<{
  instruction: Instruction
  depth?: number // Depth for indentation
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
}>()

const depthLevel = props.depth ?? 0
const colors =
  depthLevel % 2 == 0
    ? 'bg-secondary/70 text-secondary-content'
    : 'bg-secondary/70 text-secondary-content'
const marginByDepth = ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-16', 'ml-20', 'ml-24']

const indentClass = marginByDepth[depthLevel]
</script>
