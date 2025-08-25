<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { useUserInfoStore } from '@/stores/user-info'
import type { Task, TaskId } from '@/model/scripts/Script'
import { executeTask, findTask, getAllTasks } from '@/api/scripts/requests/tasks'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import NavbarLayout from '@/components/NavbarLayout.vue'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import ListSkeleton from '@/components/ListSkeleton.vue'

const userInfo = useUserInfoStore()
const tasks = ref<Task[]>()

const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    tasks.value = await getAllTasks(userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function startTask(taskId: TaskId) {
  try {
    loadingOverlay.startLoading()
    await executeTask(taskId, userInfo.token)
    const task = await findTask(taskId, userInfo.token)
    useSuccessPresenterStore().showSuccess(
      presentSuccess('The ' + task.name + ' task started', '', 3000),
    )
  } finally {
    loadingOverlay.stopLoading()
  }
}
</script>

<template>
  <NavbarLayout title="Tasks" :show-back-button="false">
    <div
      v-if="tasks?.length === 0"
      class="flex text-center text-gray-500 justify-center items-center min-h-[50vh]"
    >
      <p class="text-2xl">No tasks yet...</p>
    </div>
    <ul class="list rounded-box" v-if="tasks">
      <li class="list-row hover:bg-primary/20" v-for="task in tasks" :key="task.id">
        <RouterLink
          class="list-col-grow flex items-center"
          :to="{ name: 'task', params: { id: task.id } }"
        >
          {{ task.name }}
        </RouterLink>

        <button
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-play fa-lg !flex"
          @click="startTask(task.id)"
          :aria-label="'Start task: ' + task.name"
        ></button>
      </li>
    </ul>
    <ListSkeleton v-else />

    <AddButton name="add-task" />
  </NavbarLayout>
</template>

<style></style>
