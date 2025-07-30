<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EditList } from '@/model/permissions-management/EditList'
import type { TaskList } from '@/model/permissions-management/TaskList'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { useUserInfoStore } from '@/stores/user-info'
import { taskListDeserializer } from '@/api/permissions-management/GetTaskListDTO'
import { editListDeserializer } from '@/api/permissions-management/GetEditListDTO'
import { Role, type User } from '@/model/users-management/User'
import { usersDeserializer } from '@/api/users-management/GetUserDTO'
import type { Automation, Task } from '@/model/scripts/Script'
import { taskDeserializer } from '@/api/scripts/GetTaskDTO'
import { automationDeserializer } from '@/api/scripts/GetAutomationDTO'
import { useRoute } from 'vue-router'

const route = useRoute()
const script = ref<Task | Automation>()
const userInfo = useUserInfoStore()
const taskList = ref<TaskList>()
const editlist = ref<EditList>()
const whitelist = computed(() => taskList.value?.whitelist || [])
const blacklist = computed(() => taskList.value?.blacklist || [])
const burger = ['Editlist']
const listSelectedName = ref('Editlist')
const users = ref<User[]>([])
const open = ref(false)
const listSelectedItems = computed(() => {
  switch (listSelectedName.value) {
    case 'Whitelist':
      return whitelist.value
    case 'Blacklist':
      return blacklist.value
    case 'Editlist':
      return editlist.value?.users || []
    default:
      return []
  }
})
const usersNotInList = computed(() => {
  return calculateUsersNotInList(listSelectedItems.value || [], users.value || [])
})

onMounted(async () => {
  try {
    const res = await authorizedRequest(
      `/api/automations/${route.params.id}`,
      userInfo.token,
    )
    script.value = await deserializeBody(res, automationDeserializer)
  } catch {
    getTaskList();
  }
})

onMounted(async () => {
  const res = await authorizedRequest(
    `/api/permissions/editList/${route.params.id}`,
    userInfo.token,
  )
  editlist.value = await deserializeBody(res, editListDeserializer)
})

onMounted(async () => {
  const res = await authorizedRequest(`/api/users`, userInfo.token)
  users.value = await deserializeBody(res, usersDeserializer)
})

async function getTaskList() {
  const res = await authorizedRequest(
    `/api/tasks/${route.params.id}`,
    userInfo.token,
  )
  script.value = await deserializeBody(res, taskDeserializer)
  try {
    const res = await authorizedRequest(
      `/api/permissions/tasklists/${route.params.id}`,
      userInfo.token,
    )
    taskList.value = await deserializeBody(res, taskListDeserializer)
  } catch {
    taskList.value = { id: route.params.id as string, blacklist: [], whitelist: [] }
  }
  burger.push('Whitelist', 'Blacklist')
}

function addUser(user: User) {
  const list = listSelectedName.value.toLowerCase()
  authorizedRequest(`/api/permissions/${list}/${route.params.id}`, userInfo.token, {
    method: 'PATCH',
    body: JSON.stringify({ email: user.email }),
  })
    .then(() => {
      if (listSelectedName.value === 'Editlist' && editlist.value) {
        if (!editlist.value.users) {
          editlist.value.users = []
        }
        editlist.value.users.push(user.email)
      } else if (listSelectedName.value === 'Whitelist' && taskList.value) {
        taskList.value.whitelist.push(user.email)
      } else if (listSelectedName.value === 'Blacklist' && taskList.value) {
        taskList.value.blacklist.push(user.email)
      }
    })
    .catch((error) => {
      console.error('Error adding user:', error)
    })
}

function removeUser(userEmail: string) {
  const list = listSelectedName.value.toLowerCase()

  authorizedRequest(`/api/permissions/${list}/${route.params.id}`, userInfo.token, {
    method: 'DELETE',
    body: JSON.stringify({ email: userEmail }),
  })
    .then(() => {
      if (listSelectedName.value === 'Editlist' && editlist.value?.users) {
        const index = editlist.value.users.indexOf(userEmail)
        if (index > -1) {
          editlist.value.users.splice(index, 1)
        }
      } else if (listSelectedName.value === 'Whitelist' && taskList.value) {
        const index = taskList.value.whitelist.indexOf(userEmail)
        if (index > -1) {
          taskList.value.whitelist.splice(index, 1)
        }
      } else if (listSelectedName.value === 'Blacklist' && taskList.value) {
        const index = taskList.value.blacklist.indexOf(userEmail)
        if (index > -1) {
          taskList.value.blacklist.splice(index, 1)
        }
      }
    })
    .catch((error) => {
      console.error('Error removing user:', error)
    })
}

function select(option: string) {
  open.value = false
  listSelectedName.value = option
}

function calculateUsersNotInList(list: string[], users: User[]): User[] {
  return users.filter((user) => !list.some((email) => email === user.email))
}
</script>

<template>
  <div>
    <div class="relative">
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl font-bold dark:text-white">{{ listSelectedName }}</h1>
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
          <li class="list-row" v-for="user in listSelectedItems" :key="user">
            <div class="list-col-grow flex items-center">
              {{ user }}
            </div>

            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Remove user: ' + user"
              @click="removeUser(user)"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
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
          <li class="list-row" v-for="user in usersNotInList" :key="user.email">
            <div class="list-col-grow flex items-center">
              {{ user.nickname }}
            </div>
            <div v-if="user.role === Role.User">
              <button
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Add user: ' + user.nickname"
                @click="addUser(user)"
              >
                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 5v14M5 12h14"></path>
                  </g>
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
