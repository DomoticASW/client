<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p>Start task</p>
    <p v-if="!edit" class="font-bold truncate text-center">{{ taskName }}</p>
    <select
      v-model="(instruction.instruction as StartTaskInstruction).taskId"
      v-else
      class="select h-7 text-center text-base-content"
    >
      <option value="" selected disabled>Choose a task</option>
      <option :value="task.id" v-for="task in tasks" :key="task.id">{{ task.name }}</option>
    </select>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, StartTaskInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/user-info'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { findTask, getAllTasks } from '@/api/scripts/requests/tasks'
import { TaskId, type Task } from '@/model/scripts/Script'
const userInfo = useUserInfoStore()

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const taskName = ref('')
const tasks = ref<Task[]>([])

const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    updateTaskName(props.instruction.instruction as StartTaskInstruction)
    if (props.edit) {
      tasks.value = await getAllTasks(userInfo.token)
    }
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function updateTaskName(instruction: StartTaskInstruction) {
  taskName.value = (await findTask(TaskId(instruction.taskId), userInfo.token)).name
}
</script>
