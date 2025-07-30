<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p>Start task</p>
    <p class="font-bold truncate text-center">{{ taskName }}</p>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, StartTaskInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref } from 'vue'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { useUserInfoStore } from '@/stores/user-info'
import { taskDeserializer } from '@/api/scripts/dtos/GetTaskDTO'
const userInfo = useUserInfoStore()

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

const taskName = ref('')

onMounted(async () => {
  updateTaskName(props.instruction.instruction as StartTaskInstruction)
})

async function updateTaskName(instruction: StartTaskInstruction) {
  const res = await authorizedRequest('/api/tasks/' + instruction.taskId, userInfo.token)

  taskName.value = (await deserializeBody(res, taskDeserializer)).name
}
</script>
