<script setup lang="ts">
import { deleteTask, findTask } from '@/api/scripts/requests/tasks'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { TaskId } from '@/model/scripts/Script'
import { useInstructionsStore } from '@/stores/instructions'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import Route from '@/router/index.ts'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import NavbarLayout from '@/components/NavbarLayout.vue'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()

const instructionsStore = useInstructionsStore()
const loadingOverlay = useLoadingOverlayStore()

const taskName = ref<string>('')
const taskId = ref<TaskId>()

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    const task = await findTask(TaskId(props.id), userInfo.token)
    instructionsStore.instructions = task.instructions
    taskName.value = task.name
    taskId.value = task.id
  } catch (err: unknown) {
    if (typeof err == 'object' && err != undefined) {
      if (err && '__brand' in err) {
        if (err.__brand === 'ScriptNotFoundError') {
          Route.back()
        }
      }
      throw err
    }
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function removeTask() {
  try {
    loadingOverlay.startLoading()
    await deleteTask(taskId.value!, userInfo.token)
    Route.back()
  } finally {
    loadingOverlay.stopLoading()
  }
}
</script>

<template>
  <NavbarLayout :title="taskName" :show-back-button="true">
    <template #actions>
      <RouterLink :to="{ name: 'edit-task', params: { id: taskId } }" class="btn btn-ghost text-base"
        >Edit</RouterLink
      >
      <button class="btn btn-ghost text-error text-base" @click="removeTask()">Delete</button>
    </template>
    <InstructionItem
      v-for="(instruction, index) in instructionsStore.instructions"
      :key="index"
      :instruction="instruction"
      :id="index.toString()"
      :edit="false"
    />
    <div class="pb-4"></div>
  </NavbarLayout>
</template>
