import { getAllTasks } from '@/api/scripts/requests/tasks'
import type { Task, TaskId } from '@/model/scripts/Script'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserInfoStore } from './user-info'

export const useTasksStore = defineStore('tasks', () => {
  const userInfo = useUserInfoStore()
  const tasks = ref<Task[]>([])

  async function updateTasks() {
    tasks.value = await getAllTasks(userInfo.token)
  }

  function getTask(taskId: TaskId) {
    return tasks.value?.find((t) => t.id === taskId)
  }

  return { tasks, updateTasks, getTask }
})
