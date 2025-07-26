<script setup lang="ts">
import { useScript } from '@/stores/task-automation'
import { onMounted, reactive, ref } from 'vue'
import { isGetDeviceEventTriggerDTO, isGetPeriodTriggerDTO } from '@/api/scripts/GetAutomationDTO'
import { isGetInstructionDTO } from '@/api/scripts/GetInstructionDTO'
import type { EditList } from '@/model/permissions-management/EditList'
import type { TaskList } from '@/model/permissions-management/TaskList'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { useUserInfoStore } from '@/stores/user-info'
import { taskListDeserializer } from '@/api/permissions-management/GetTaskListDTO'
import { editListDeserializer } from '@/api/permissions-management/GetEditListDTO'

const scriptStore = useScript()
const userInfo = useUserInfoStore()
const taskList = ref<TaskList>()
const editlist = ref<EditList>()
const whitelist = taskList.value?.whitelist
const blacklist = taskList.value?.blacklist
const burger = ['Editlist']
const listSelected = reactive({ name: 'Editlist', items: editlist.value?.users })
const users = ['Hugo', 'Arianna']
const open = ref(false)

onMounted(async () => {
  try {
    const res = await authorizedRequest(
      `/api/permissions/editList/${scriptStore.script.id}`,
      userInfo.token,
    )
    editlist.value = await deserializeBody(res, editListDeserializer)
  } catch {
    editlist.value = { id: scriptStore.script.id, users: [] }
  }
})

if (isTask(scriptStore.script)) {
  onMounted(async () => {
    try {
      const res = await authorizedRequest(
        `/api/permissions/tasklists/${scriptStore.script.id}`,
        userInfo.token,
      )
      taskList.value = await deserializeBody(res, taskListDeserializer)
    } catch {
      taskList.value = { id: scriptStore.script.id, blacklist: [], whitelist: [] }
    }
  })

  burger.push('Whitelist', 'Blacklist')
}

function isAutomation(o: unknown): o is unknown {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'id' in o &&
    typeof o.id === 'string' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'enabled' in o &&
    typeof o.enabled === 'boolean' &&
    'trigger' in o &&
    (isGetDeviceEventTriggerDTO(o.trigger) || isGetPeriodTriggerDTO(o.trigger)) &&
    'instructions' in o &&
    Array.isArray(o.instructions) &&
    o.instructions.every((instruction) => isGetInstructionDTO(instruction))
  )
}

function isTask(o: unknown): o is unknown {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'id' in o &&
    typeof o.id === 'string' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'instructions' in o &&
    Array.isArray(o.instructions) &&
    o.instructions.every((instruction) => isGetInstructionDTO(instruction))
  )
}
function addUser(user: string) {
  // TODO: Implement the logic to add the user
  console.log(`Adding user: ${user}`)
}

function removeUser(user: string) {
  // TODO: Implement the logic to add the user
  console.log(`Adding user: ${user}`)
}

function select(option: string) {
  open.value = false
  switch (option) {
    case 'Whitelist':
      listSelected.name = 'Whitelist'
      listSelected.items = whitelist
      break
    case 'Blacklist':
      listSelected.name = 'Blacklist'
      listSelected.items = blacklist
      break
    case 'Editlist':
      listSelected.name = 'Editlist'
      listSelected.items = editlist.value?.users
      break
  }
}
</script>

<template>
  <div>
    <div class="relative">
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl font-bold dark:text-white">{{ listSelected.name }}</h1>
        <button class="btn btn-circle btn-ghost" type="button" @click="open = !open">
          <svg
            class="size-[1.2em] transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M6 9l6 6 6-6"></path>
            </g>
          </svg>
        </button>
      </div>
      <transition
        name="slide"
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-150 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="open"
          class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <ul>
            <li
              @click="select(list)"
              class="list-row px-4 py-2 hover:bg-gray-100 cursor-pointer"
              v-for="list in burger"
              :key="list"
            >
              {{ list }}
            </li>
          </ul>
        </div>
      </transition>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in listSelected.items" :key="user">
            <div class="list-col-grow flex items-center">
              {{ user }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Get permissions of: ' + user"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  @click="removeUser(user)"
                >
                  <path d="M6 6l12 12M6 18L18 6"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <hr class="my-4 border-gray-300" />
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Users</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in users" :key="user">
            <div class="list-col-grow flex items-center">
              {{ user }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Get permissions of: ' + user"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  @click="addUser(user)"
                >
                  <path d="M12 5v14M5 12h14"></path>
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
