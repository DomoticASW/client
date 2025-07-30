<script setup lang="ts">
import { authorizedRequest, deserializeBody } from '@/api/api'
import { registrationRequestsDeserializer } from '@/api/users-management/GetRegistrationRequestDTO'
import { usersDeserializer } from '@/api/users-management/GetUserDTO'
import type { RegistrationRequest } from '@/model/users-management/RegistrationRequest'
import { Role, type User } from '@/model/users-management/User'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const loadingOverlay = useLoadingOverlayStore()
const showToast = ref(false)
const toastMessage = ref('')
const userInfo = useUserInfoStore()
const registeredUsers = ref<User[]>()
const unregisteredUsers = ref<RegistrationRequest[]>()
onMounted(async () => {
  const res = await authorizedRequest(`/api/users`, userInfo.token)
  registeredUsers.value = await deserializeBody(res, usersDeserializer)
})
onMounted(async () => {
  const res = await authorizedRequest(`/api/registrationRequests`, userInfo.token)
  unregisteredUsers.value = await deserializeBody(res, registrationRequestsDeserializer)
})

function removeUser(user: User) {
  try {
    loadingOverlay.startLoading()
    authorizedRequest(`/api/users/${user.email}`, userInfo.token, {
      method: 'DELETE',
    })
      .then(() => {
        registeredUsers.value = registeredUsers.value?.filter((u) => u.email !== user.email)
        showToastMessage(`Request for ${user.nickname} removed successfully.`)
      })
      .catch((error) => {
        console.error('Error removing request:', error)
      })
  } finally {
    loadingOverlay.stopLoading()
  }
}

function rejectRequest(user: RegistrationRequest) {
  try {
      authorizedRequest(`/api/registrationRequests/${user.email}/reject`, userInfo.token, {
      method: 'POST',
    })
      .then(() => {
        unregisteredUsers.value = unregisteredUsers.value?.filter((u) => u.email !== user.email)
        showToastMessage(`Request for ${user.nickname} rejected successfully.`)
      })
      .catch((error) => {
        console.error('Error rejecting request:', error)
      })
  } finally {
    loadingOverlay.stopLoading()
  }
}

function approveRequest(user: RegistrationRequest) {
  try {
    loadingOverlay.startLoading()
    authorizedRequest(`/api/registrationRequests/${user.email}/approve`, userInfo.token, {
      method: 'POST',
    })
      .then(() => {
        unregisteredUsers.value = unregisteredUsers.value?.filter((u) => u.email !== user.email)
        const newUser: User = {
          email: user.email,
          nickname: user.nickname,
          passwordHash: user.passwordHash,
          role: Role.User,
        }
        registeredUsers.value?.push(newUser)
        showToastMessage(`Request for ${user.nickname} accepted successfully.`)
      })
      .catch((error) => {
        console.error('Error approving request:', error)
      })
  } finally {
    loadingOverlay.stopLoading()
  }
}

function showToastMessage(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000) // 2 seconds
}
</script>

<template>
  <div>
    <!-- Toast -->
    <div
      v-if="showToast"
      class="toast toast-center toast-success fixed top-10 left-1/2 transform -translate-x-1/2"
    >
      <div class="alert alert-success shadow-lg">
        <div>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </div>
    <div>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in registeredUsers" :key="user.email">
            <div class="list-col-grow flex flex-col">
              <div>{{ user.nickname }}</div>
              <small class="text-gray-400 ms-1">{{ user.email }}</small>
            </div>
            <small v-if="user.role == Role.Admin" class="text-gray-400 flex items-center">{{
              user.role
            }}</small>
            <button
              v-else
              class="btn btn-circle btn-ghost fa-solid fa-xmark"
              type="button"
              :aria-label="'Remove: ' + user"
              @click="removeUser(user)"
            >
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <hr class="my-4 border-gray-300" />
      <h1 class="text-2xl dark:text-white text-center">Registration requests</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in unregisteredUsers" :key="user.email">
            <div class="list-col-grow flex flex-col">
              <div>{{ user.nickname }}</div>
              <small class="text-gray-400 ms-1">{{ user.email }}</small>
            </div>
            <div>
              <button
                class="btn btn-circle btn-ghost fa-solid fa-xmark"
                type="button"
                :aria-label="'Remove request of: ' + user"
                @click="rejectRequest(user)"
              >
              </button>
              <button
                class="btn btn-circle btn-ghost fa-solid fa-plus"
                type="button"
                :aria-label="'Accept request of: ' + user"
                @click="approveRequest(user)"
              >
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
