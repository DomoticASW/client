<template>
  <component
    :is="getComponentForInstruction(instruction)"
    :instruction="instruction"
    :depth="depth ?? 0"
    :indent="indentClass"
  />
</template>

<script setup lang="ts">
import type {
  ConstantInstruction,
  CreateDevicePropertyConstantInstruction,
  DeviceActionInstruction,
  IfInstruction,
  Instruction,
  SendNotificationInstruction,
} from './types.js'

import IfInstructionItem from '@/components/tasks-automations/IfInstructionItem.vue'

import ConstantInstructionItem from '@/components/tasks-automations/ConstantInstructionItem.vue'
import CreateDevicePropertyConstantInstructionItem from '@/components/tasks-automations/CreateDevicePropertyConstantInstructionItem.vue'

import DeviceActionInstructionItem from '@/components/tasks-automations/DeviceActionInstructionItem.vue'
import SendNotificationInstructionItem from '@/components/tasks-automations/SendNotificationInstructionItem.vue'

const props = defineProps<{
  instruction: Instruction
  depth?: number // Depth for indentation
}>()

const depthLevel = props.depth ?? 0
const marginByDepth = ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-16', 'ml-20', 'ml-24']

const indentClass = marginByDepth[depthLevel]

function getComponentForInstruction(instruction: Instruction) {
  if (isCreateDevicePropertyConstantInstruction(instruction))
    return CreateDevicePropertyConstantInstructionItem
  if (isDeviceActionInstruction(instruction)) return DeviceActionInstructionItem
  if (isIfInstruction(instruction)) return IfInstructionItem
  if (isConstantInstruction(instruction)) return ConstantInstructionItem
  if (isSendNotificationInstruction(instruction)) return SendNotificationInstructionItem
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSendNotificationInstruction(o: any): o is SendNotificationInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'email' in o &&
    typeof o.email === 'string' &&
    'message' in o &&
    typeof o.message === 'string'
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDeviceActionInstruction(o: any): o is DeviceActionInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'deviceActionId' in o &&
    typeof o.deviceActionId === 'string' &&
    'input' in o
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isConstantInstruction(o: any): o is ConstantInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'value' in o &&
    !isCreateDevicePropertyConstantInstruction(o)
  ) //Just to not have property constant ad constants, not needed with final code
}

function isCreateDevicePropertyConstantInstruction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: any,
): o is CreateDevicePropertyConstantInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'devicePropertyId' in o &&
    typeof o.devicePropertyId === 'string' &&
    'value' in o
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIfInstruction(o: any): o is IfInstruction {
  return o && typeof o === 'object' && 'then' in o && Array.isArray(o.then)
}
</script>
