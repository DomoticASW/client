<template>
  <IfInstructionItem
    v-if="
      instruction.type === InstructionType.IfInstruction ||
      instruction.type === InstructionType.IfElseInstruction
    "
    :id="id"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
  />
  <ConstantInstructionItem
    v-else-if="instruction.type === InstructionType.CreateConstantInstruction"
    :id="id"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
  />
  <CreateDevicePropertyConstantInstructionItem
    v-else-if="instruction.type === InstructionType.CreateDevicePropertyConstantInstruction"
    :id
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
  />
  <DeviceActionInstructionItem
    v-else-if="instruction.type === InstructionType.DeviceActionInstruction"
    :id="id"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
  />
  <SendNotificationInstructionItem
    v-else-if="instruction.type === InstructionType.SendNotificationInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
  />
  <WaitInstructionItem
    v-else-if="instruction.type === InstructionType.WaitInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
  />
  <StartTaskInstructionItem
    v-else-if="instruction.type === InstructionType.StartTaskInstruction"
    :instruction="instruction"
    :depth="depthLevel"
    :indent="indentClass"
    :colors="colors"
    :edit="edit"
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
  id: string
  instruction: Instruction
  depth?: number // Depth for indentation
  edit: boolean
}>()

const depthLevel = props.depth ?? 0
const colors =
  depthLevel % 2 == 0
    ? 'bg-primary/5 text-base-content'
    : 'bg-primary/5 text-base-content'
const marginByDepth = ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-16', 'ml-20', 'ml-24']

const indentClass = marginByDepth[depthLevel]
</script>
