<script setup lang="ts">
import router from '@/router'
const tasks = ['Turns lights off', 'Close windows', "Play music (Emma's room)"]
const automations = ['Washing machine done']

function goToPermissions(id: string) {
  router.push(`./automations-task-permissions/${id}`)
}
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Tasks</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="task in tasks" :key="task">
            <div class="list-col-grow flex items-center">
              {{ task }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Get permissions of: ' + task"
              @click="goToPermissions(task)"
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
          </li>
        </ul>
      </div>
    </div>
    <div>
      <hr class="my-4 border-gray-300" />
      <h1 class="text-2xl font-bold dark:text-white">Automations</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="automation in automations" :key="automation">
            <div class="list-col-grow flex items-center">
              {{ automation }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Get permissions of: ' + automation"
              @click="goToPermissions(automation)"
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
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
