<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import NavbarLayout from '@/components/NavbarLayout.vue';
import type { EditList } from '@/model/permissions-management/EditList'
import type { TaskList } from '@/model/permissions-management/TaskList'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { useUserInfoStore } from '@/stores/user-info'
import { taskListDeserializer } from '@/api/permissions-management/GetTaskListDTO'
import { editListDeserializer } from '@/api/permissions-management/GetEditListDTO'
import { Role, type User } from '@/model/users-management/User'
import type { Automation, Task } from '@/model/scripts/Script'
import { useRoute } from 'vue-router'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import { automationDeserializer } from '@/api/scripts/dtos/GetAutomationDTO'
import { usersDeserializer } from '@/api/users-management/dtos/GetUserDTO'
import { taskDeserializer } from '@/api/scripts/dtos/GetTaskDTO'

const route = useRoute()
const loadingOverlay = useLoadingOverlayStore()
const successPresenter = useSuccessPresenterStore()
const script = ref<Task | Automation>()
const userInfo = useUserInfoStore()
const taskList = ref<TaskList>()
const editlist = ref<EditList>()
const whitelist = computed(() => taskList.value?.whitelist || [])
const blacklist = computed(() => taskList.value?.blacklist || [])
const burger = ref(['Editlist'])
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
  burger.value.push('Whitelist', 'Blacklist')
}

function addUser(user: User) {
  const list = listSelectedName.value.toLowerCase()
  try {
    loadingOverlay.startLoading()
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
        showToastMessage(`${user.nickname} added to the ${listSelectedName.value}.`)
      })
      .catch((error) => {
        console.error('Error adding user:', error)
      })
  } finally {
    loadingOverlay.stopLoading();
  }
}

function removeUser(userEmail: string) {
  const list = listSelectedName.value.toLowerCase()
  try {
    loadingOverlay.startLoading();
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
        showToastMessage(`${userFromEmail(userEmail)?.nickname ?? "User"} removed from the ${listSelectedName.value}.`)
      })
      .catch((error) => {
        console.error('Error removing user:', error)
      })
  } finally {
    loadingOverlay.stopLoading();
  }
}

function select(option: string) {
  open.value = false
  listSelectedName.value = option
}

function calculateUsersNotInList(list: string[], users: User[]): User[] {
  return users.filter((user) => !list.some((email) => email === user.email))
}

function userFromEmail(email: string): User | undefined {
  return users.value.find(u => u.email === email)
}

function showToastMessage(msg: string) {
  successPresenter.showSuccess(presentSuccess(msg, "", 5000))
}
</script>

<template>
  <NavbarLayout :title="script?.name" :show-back-button="true">
  <div>
    <div class="relative">
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl font-bold dark:text-white">{{ listSelectedName }}</h1>
        <div v-if="burger.length > 1">
          <button class="btn btn-circle btn-ghost fa-solid fa-angle-down" type="button" @click="open = !open"></button>
        </div>
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
            <span class="fa-solid fa-user text-xl self-center"></span>
            <div class="list-col-grow flex items-center">
              {{ user }}
            </div>
            <button
              class="btn btn-circle btn-ghost fa-solid fa-xmark"
              type="button"
              :aria-label="'Remove user: ' + user"
              @click="removeUser(user)"
            >
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
            <span class="fa-solid fa-user text-xl self-center"></span>
            <div class="list-col-grow flex items-center">
              {{ user.nickname }}
            </div>
            <div v-if="user.role === Role.User">
              <button
                class="btn btn-circle btn-ghost fa-solid fa-plus"
                type="button"
                :aria-label="'Add user: ' + user.nickname"
                @click="addUser(user)"
              >
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  </NavbarLayout>
</template>

<style></style>
