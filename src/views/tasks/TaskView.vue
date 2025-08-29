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
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import { useErrorPresenterStore } from '@/stores/error-presenter'
import { useDevicesStore } from '@/stores/devices'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()

const instructionsStore = useInstructionsStore()
const loadingOverlay = useLoadingOverlayStore()
const errorPresenter = useErrorPresenterStore()

const taskName = ref<string>('')
const taskId = ref<TaskId>()

onMounted(async () => {
  await useDevicesStore().updateDevices()
  await useUsersStore().updateUsers()
  try {
    loadingOverlay.startLoading()
    const task = await findTask(TaskId(props.id), userInfo.token)
    instructionsStore.instructions = task.instructions
    taskName.value = task.name
    taskId.value = task.id
  } catch (err) {
    if (typeof err == 'object' && err) {
      errorPresenter.showError(err, Route.back)
    }
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function removeTask() {
  try {
    loadingOverlay.startLoading()
    await deleteTask(taskId.value!, userInfo.token)
    useSuccessPresenterStore().showSuccess(
      presentSuccess('The ' + taskName.value + ' task has been deleted', '', 3000),
    )
    Route.back()
  } finally {
    loadingOverlay.stopLoading()
  }
}
</script>

<template>
  <NavbarLayout :title="taskName" :show-back-button="true">
    <template #actions>
      <RouterLink
        :to="{ name: 'edit-task', params: { id: taskId } }"
        class="btn btn-ghost text-base"
        >Edit</RouterLink
      >
      <button class="btn btn-ghost text-error text-base" @click="removeTask()">Delete</button>
    </template>
    <h1 class="text-xl">Instructions</h1>
    <div
      v-if="instructionsStore.instructions.length === 0"
      class="flex text-center text-gray-500 justify-center items-center min-h-[50vh]"
    >
      <p class="text-2xl">No instructions yet...</p>
    </div>
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
