<script async setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { useUserInfoStore } from '@/stores/user-info'
import type { Task } from '@/model/scripts/Script'
import { tasksDeserializer } from '@/api/scripts/GetTaskDTO'

const userInfo = useUserInfoStore()

const tasks = ref<Task[]>([])

onMounted(async () => {
  const res = await authorizedRequest('/api/tasks', userInfo.token)

  tasks.value = await deserializeBody(res, tasksDeserializer)
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
