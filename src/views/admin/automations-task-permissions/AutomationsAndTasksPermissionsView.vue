<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
import { authorizedRequest } from '@/utils'
import { ref } from 'vue'

interface Task {
  readonly id: string
  name: string

  instructions: any[]
}

interface Automation {
  readonly id: string
  name: string

  instructions: any[]

  enabled: boolean
  trigger: any
}

const userInfo = useUserInfoStore()
const tasks = ref<Task[] | undefined>(undefined)
const automations = ref<Automation[] | undefined>(undefined)
authorizedRequest('/api/tasks', userInfo.token).then(({ json }) => {
  tasks.value = json as Task[]
})
authorizedRequest('/api/automations', userInfo.token).then(({ json }) => {
  automations.value = json as Automation[]
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
              <button
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
              </button>
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
              <button
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
              </button>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
