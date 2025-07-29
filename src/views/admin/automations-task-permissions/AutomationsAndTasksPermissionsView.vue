<script setup lang="ts">
import { authorizedRequest, deserializeBody } from '@/api/api'
import { automationDeserializer } from '@/api/scripts/GetAutomationDTO'
import { tasksDeserializer } from '@/api/scripts/GetTaskDTO'
import type { Automation, Task } from '@/model/scripts/Script'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const userInfo = useUserInfoStore()
const tasks = ref<Task[]>()
const automations = ref<Automation[]>()

onMounted(async () => {
  const res = await authorizedRequest('/api/tasks', userInfo.token)
  tasks.value = await deserializeBody(res, tasksDeserializer)
})
onMounted(async () => {
  const res = await authorizedRequest('/api/automations', userInfo.token)
  automations.value = await deserializeBody(res, (data) =>
    Array.isArray(data) ? data.map(automationDeserializer) : [],
  )
})

</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Tasks</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="task in tasks" :key="task.id">
            <div class="list-col-grow flex items-center">
              {{ task.name }}
            </div>
            <RouterLink :to="{ name: 'automation-and-task-permission', params: { id: task.id } }">
              <a
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Get permissions of: ' + task.name"
              >
                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 3L20 12 6 21 6 3z"></path>
                  </g>
                </svg>
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <hr class="my-4 border-gray-300" />
      <h1 class="text-2xl font-bold dark:text-white">Automations</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="automation in automations" :key="automation.id">
            <div class="list-col-grow flex items-center">
              {{ automation.name }}
            </div>
            <RouterLink
              :to="{ name: 'automation-and-task-permission', params: { id: automation.id } }"
            >
              <a
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Get permissions of: ' + automation.name"
              >
                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 3L20 12 6 21 6 3z"></path>
                  </g>
                </svg>
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
