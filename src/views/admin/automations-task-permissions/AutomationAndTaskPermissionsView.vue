<template>
  <NavbarLayout :title="script?.name" :show-back-button="true">
  <div>
    <div class="relative">
      <details ref="devices-selected-group-dropdown" class="dropdown" v-if="burger.length > 1">
        <summary class="btn btn-lg btn-primary mb-2 min-w-32 flex justify-between">
          {{ listSelectedName }}
          <span class="fa-solid fa-caret-down ps-4"></span>
        </summary>
        <div class="fixed size-full inset-0 z-999" @click.stop="closeDropdown"></div>
        <ul
          class="menu dropdown-content rounded-box w-52 p-2 bg-base-100 border border-primary gap-1"
        >
          <li v-for="g in burger" v-bind:key="g">
            <a @click="select(g)" :class="{ 'menu-active': g == listSelectedName }">
              {{ g }}
            </a>
          </li>
        </ul>
      </details>
      <h1 class="text-2xl font-bold dark:text-white" v-else>{{ listSelectedName }}</h1>
      <div>
        <ul class="list rounded-box">
          <div v-for="user in listSelectedItems" :key="user">
            <li class="list-row" v-if="isNotAdmin(user)">
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
          </div>
        </ul>
        <div v-if="listSelectedItems?.length === 0" class="flex text-center text-gray-500 justify-center items-center min-h-[30vh]">
          <p class="text-2xl">No user other than the admin can edit this task right now</p>
        </div>
      </div>
    </div>
    <hr class="my-4 border-gray-300" />
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Users</h1>
      <div>
        <ul class="list rounded-box">
          <div v-for="user in usersNotInList" :key="user.email">
            <li class="list-row" v-if="user.role !== Role.Admin">
              <span class="fa-solid fa-user text-xl self-center"></span>
              <div class="list-col-grow flex items-center">
                {{ user.nickname }}
              </div>
              <button
                class="btn btn-circle btn-ghost fa-solid fa-plus"
                type="button"
                :aria-label="'Add user: ' + user.nickname"
                @click="addUser(user)"
              >
              </button>
            </li>
          </div>
        </ul>
        <div v-if="usersNotInList?.length === 0 || isAdminList(usersNotInList)" class="flex text-center text-gray-500 justify-center items-center min-h-[30vh]">
          <p class="text-2xl">No more users to add...</p>
        </div>
      </div>
    </div>
  </div>
  </NavbarLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
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
const dropdown = useTemplateRef('devices-selected-group-dropdown')
const listSelectedItems = computed(() => {
  let raw: string[] = []
  switch (listSelectedName.value) {
    case 'Whitelist':
      raw = whitelist.value
      break
    case 'Blacklist':
      raw = blacklist.value
      break
    case 'Editlist':
      raw = editlist.value?.users || []
      break
  }
  return raw.filter(email => isNotAdmin(email))
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

async function addUser(user: User) {
  const list = listSelectedName.value.toLowerCase()
  try {
    loadingOverlay.startLoading()
    await authorizedRequest(`/api/permissions/${list}/${route.params.id}`, userInfo.token, {
      method: 'PATCH',
      body: JSON.stringify({ email: user.email }),
    })
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
  } finally {
    loadingOverlay.stopLoading();
  }
}

async function removeUser(userEmail: string) {
  const list = listSelectedName.value.toLowerCase()
  try {
    loadingOverlay.startLoading();
    await authorizedRequest(`/api/permissions/${list}/${route.params.id}`, userInfo.token, {
      method: 'DELETE',
      body: JSON.stringify({ email: userEmail }),
    })
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
  } finally {
    loadingOverlay.stopLoading();
  }
}

function select(option: string) {
  open.value = false
  listSelectedName.value = option
  closeDropdown()
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

function isNotAdmin(user: string): boolean {
  const u = userFromEmail(user)
  return u?.role === Role.User
}

function isAdminList(list: User[]): boolean {
  return list.filter(user => user.role !== Role.Admin).length === 0
}

function closeDropdown() {
  dropdown.value!.removeAttribute('open')
}
</script>
<style></style>
