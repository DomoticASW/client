<script setup lang="ts">
import { authorizedRequest, deserializeBody } from '@/api/api'
import { userInfoDeserializer } from '@/api/users-management/GetUserInfoDTO'
import { Role, type UserInfo } from '@/model/users-management/User'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const showToast = ref(false)
const toastMessage = ref('')
const userInfo = useUserInfoStore()
const registeredUsers = ref<UserInfo[] | undefined>(undefined)
const unregisteredUsers = ref<UserInfo[] | undefined>(undefined)
onMounted(async () => {
  const res = await authorizedRequest(`/api/users`, userInfo.token)
  registeredUsers.value = await deserializeBody(res, userInfoDeserializer)
})
onMounted(async () => {
  const res = await authorizedRequest(`/api/registrationRequests`, userInfo.token)
  unregisteredUsers.value = await deserializeBody(res, userInfoDeserializer)
})

function removeUser(user: UserInfo) {
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
}

function rejectRequest(user: UserInfo) {
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
}

function approveRequest(user: UserInfo) {
  authorizedRequest(`/api/registrationRequests/${user.email}/approve`, userInfo.token, {
    method: 'POST',
  })
    .then(() => {
      unregisteredUsers.value = unregisteredUsers.value?.filter((u) => u.email !== user.email)
      registeredUsers.value?.push(user)
      showToastMessage(`Request for ${user.nickname} accepted successfully.`)
    })
    .catch((error) => {
      console.error('Error approving request:', error)
    })
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
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Remove: ' + user"
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
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Remove request of: ' + user"
                @click="rejectRequest(user)"
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
              <button
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Accept request of: ' + user"
                @click="approveRequest(user)"
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
