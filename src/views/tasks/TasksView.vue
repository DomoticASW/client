<script async setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { useUserInfoStore } from '@/stores/user-info'
import type { Task } from '@/model/scripts/Script'
import { getAllTasks } from '@/api/scripts/requests/tasks'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'

const userInfo = useUserInfoStore()
const tasks = ref<Task[]>([])

const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  try {
    tasks.value = await getAllTasks(userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
})
</script>

<template>
  <ul class="list rounded-box" v-if="tasks">
    <RouterLink
      v-for="task in tasks"
      :key="task.id"
      :to="{ name: 'task', params: { id: task.id } }"
    >
      <li class="list-row">
        <div class="list-col-grow flex items-center">
          {{ task.name }}
        </div>
        <a
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-play fa-lg !flex"
          :aria-label="'Start task: ' + task"
        ></a>
      </li>
    </RouterLink>
  </ul>

  <AddButton name="add-task" />
</template>

<style></style>
