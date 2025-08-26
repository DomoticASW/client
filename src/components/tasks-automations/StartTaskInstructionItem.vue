<template>
  <InstructionLayout :colors="colors" :edit="edit" :instruction="props.instruction" v-if="tasks">
    <p>Start task</p>
    <p v-if="!edit" class="font-bold truncate text-center">{{ taskName }}</p>
    <select
      v-model="(instruction.instruction as StartTaskInstruction).taskId"
      v-else
      class="select h-7 text-center select-primary"
    >
      <option selected disabled>Choose a task</option>
      <option :value="task.id" v-for="task in tasks" :key="task.id">{{ task.name }}</option>
    </select>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, StartTaskInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import { useUserInfoStore } from '@/stores/user-info'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { getAllTasks } from '@/api/scripts/requests/tasks'
import { type Task } from '@/model/scripts/Script'
const userInfo = useUserInfoStore()

const props = defineProps<{
  instruction: Instruction
  colors: string
  edit: boolean
}>()

const taskName = ref<string>()
const tasks = ref<Task[]>()

const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    tasks.value = await getAllTasks(userInfo.token)
    updateTaskName(props.instruction.instruction as StartTaskInstruction)
  } finally {
    loadingOverlay.stopLoading()
  }
})

watch(
  () => props.instruction,
  (val) => {
    updateTaskName(val.instruction as StartTaskInstruction)
  },
)

async function updateTaskName(instruction: StartTaskInstruction) {
  taskName.value = tasks.value?.find((t) => t.id === instruction.taskId)?.name
}
</script>
