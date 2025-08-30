<script setup lang="ts">
import { authorizedRequest, deserializeBody } from '@/api/api'
import NavbarLayout from '@/components/NavbarLayout.vue';
import { automationDeserializer } from '@/api/scripts/dtos/GetAutomationDTO'
import { tasksDeserializer } from '@/api/scripts/dtos/GetTaskDTO'
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
  <NavbarLayout title="Manage scripts permissions">
  <div>
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Tasks</h1>
      <div>
        <ul class="list rounded-box">
          <RouterLink v-for="task in tasks" :key="task.id" :to="{ name: 'automation-and-task-permission', params: { id: task.id } }">
            <li class="list-row hover:bg-primary/20">
              <div class="list-col-grow flex items-center">
                {{ task.name }}
              </div>
              <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
            </li>
          </RouterLink>
        </ul>
      </div>
      <div v-if="tasks?.length === 0" class="flex text-center text-gray-500 justify-center items-center min-h-[30vh]">
        <p class="text-2xl">No tasks yet...</p>
      </div>
    </div>
    <div>
      <hr class="my-4 border-gray-300" />
      <h1 class="text-2xl font-bold dark:text-white">Automations</h1>
      <div>
        <ul class="list rounded-box">
          <RouterLink v-for="automation in automations" :key="automation.id"
            :to="{ name: 'automation-and-task-permission', params: { id: automation.id } }"
          >
          <li class="list-row hover:bg-primary/20">
            <div class="list-col-grow flex items-center">
              {{ automation.name }}
            </div>
            <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
          </li>
          </RouterLink>
        </ul>
      </div>
      <div v-if="automations?.length === 0" class="flex text-center text-gray-500 justify-center items-center min-h-[30vh]">
        <p class="text-2xl">No automation yet...</p>
      </div>
    </div>
  </div>
  <template #actions>
    <button
      class="fa-circle-info fa-solid fa-xl btn btn-ghost btn-circle"
      onclick="permissions_info.showModal()"
    ></button>
  </template>
  <dialog id="permissions_info" class="modal modal-sm">
      <div class="modal-box max-w-sm">
        <h2 class="card-title mb-2">Scripts permissions info</h2>
        <p>
          In this page, you can modify the editlist (task/automation), whitelist and blacklist (only for tasks).
        </p>
        <p>
          You are not showed in these lists since they already have every permission to modify and execute every task and automation.
        </p>
        <ul class="list-disc list-inside">
          <li>
            <span class="font-bold">Editlist</span>: every user inside it can edit the task/automation.
          </li>
          <li>
            <span class="font-bold">Whitelist</span>: a whitelisted user can execute the task
              even if he doesn't have the permissions for user-device permissions inside it.
          </li>
          <li>
            <span class="font-bold">Blacklist</span>: a blacklisted user can't execute the task
              even if he has the permissions for user-device permissions inside it.
          </li>
        </ul>
        <p> A blacklisted user can't be added in the whitelist and vice versa.</p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>Ok</button>
      </form>
    </dialog>
  </NavbarLayout>
</template>

<style></style>
