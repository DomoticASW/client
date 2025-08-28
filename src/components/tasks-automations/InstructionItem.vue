<template>
  <IfInstructionItem
    v-if="
      instruction.type === InstructionType.IfInstruction ||
      instruction.type === InstructionType.IfElseInstruction
    "
    :id="id"
    :instruction="instruction"
    :colors="colors"
    :edit="edit"
    :depth="depth ?? 0"
  />
  <ConstantInstructionItem
    v-else-if="instruction.type === InstructionType.CreateConstantInstruction"
    :id="id"
    :instruction="instruction"
    :colors="colors"
    :edit="edit"
  />
  <CreateDevicePropertyConstantInstructionItem
    v-else-if="instruction.type === InstructionType.CreateDevicePropertyConstantInstruction"
    :id
    :instruction="instruction"
    :colors="colors"
    :edit="edit"
  />
  <DeviceActionInstructionItem
    v-else-if="instruction.type === InstructionType.DeviceActionInstruction"
    :id="id"
    :instruction="instruction"
    :colors="colors"
    :edit="edit"
  />
  <SendNotificationInstructionItem
    v-else-if="instruction.type === InstructionType.SendNotificationInstruction"
    :instruction="instruction"
    :colors="colors"
    :edit="edit"
  />
  <WaitInstructionItem
    v-else-if="instruction.type === InstructionType.WaitInstruction"
    :instruction="instruction"
    :colors="colors"
    :edit="edit"
  />
  <StartTaskInstructionItem
    v-else-if="instruction.type === InstructionType.StartTaskInstruction"
    :instruction="instruction"
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

defineProps<{
  id: string
  instruction: Instruction
  depth?: number
  edit: boolean
}>()

const colors = 'bg-base-300 text-base-content border border-neutral shadow-lg'

</script>
