<script setup lang="ts">
import NavbarLayout from '@/components/NavbarLayout.vue'
import type { RegistrationRequest } from '@/model/users-management/RegistrationRequest'
import { Role, type User } from '@/model/users-management/User'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import { useUserInfoStore } from '@/stores/user-info'
import { computed, onMounted, ref } from 'vue'
import {
  approveRegistrationRequest,
  rejectRegistrationRequest,
  deleteUser,
  getAllUsers,
} from '@/api/users-management/requests/users'
import { useRegistrationRequestsStore } from '@/stores/registrationRequests'

const loadingOverlay = useLoadingOverlayStore()
const successPresenter = useSuccessPresenterStore()
const registrationRequestsStore = useRegistrationRequestsStore()
const userInfo = useUserInfoStore()
const registeredUsers = ref<User[]>()
const unregisteredUsers = computed(() => registrationRequestsStore.registrationRequests)

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    Promise.all([
      (registeredUsers.value = await getAllUsers(userInfo.token)),
      await registrationRequestsStore.updateRegistrationRequests(),
    ])
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function removeUser(user: User) {
  try {
    loadingOverlay.startLoading()
    await deleteUser(userInfo.token, user.email)
    registeredUsers.value = registeredUsers.value?.filter((u) => u.email !== user.email)
    showToastMessage(`Request for ${user.nickname} removed successfully.`)
  } finally {
    loadingOverlay.stopLoading()
  }
}

async function rejectRequest(req: RegistrationRequest) {
  try {
    await rejectRegistrationRequest(userInfo.token, req.email)
    registrationRequestsStore.removeRequest(req)
    showToastMessage(`Request for ${req.nickname} rejected successfully.`)
  } finally {
    loadingOverlay.stopLoading()
  }
}

async function approveRequest(req: RegistrationRequest) {
  try {
    loadingOverlay.startLoading()
    await approveRegistrationRequest(userInfo.token, req.email)
    registrationRequestsStore.removeRequest(req)
    const newUser: User = {
      email: req.email,
      nickname: req.nickname,
      role: Role.User,
    }
    registeredUsers.value?.push(newUser)
    showToastMessage(`Request for ${req.nickname} accepted successfully.`)
  } finally {
    loadingOverlay.stopLoading()
  }
}

function showToastMessage(msg: string) {
  successPresenter.showSuccess(presentSuccess(msg, '', 5000))
}
</script>

<template>
  <NavbarLayout title="Users permissions">
    <div>
      <div>
        <div>
          <ul class="list rounded-box">
            <li class="list-row" v-for="user in registeredUsers" :key="user.email">
              <span
                v-if="user.role == Role.Admin"
                class="fa-solid fa-user-tie text-2xl self-center"
              ></span>
              <span v-else class="fa-solid fa-user text-2xl self-center"></span>
              <div class="list-col-grow flex flex-col">
                <div>{{ user.nickname }}</div>
                <small class="text-gray-400">{{ user.email }}</small>
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
              ></button>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr class="my-4 border-gray-300" />
        <h1
          class="text-2xl dark:text-white text-center"
          v-if="!!unregisteredUsers && unregisteredUsers?.length > 0"
        >
          Registration requests
        </h1>
        <div>
          <ul class="list rounded-box">
            <li class="list-row" v-for="user in unregisteredUsers" :key="user.email">
              <span class="fa-solid fa-user text-2xl self-center"></span>
              <div class="list-col-grow flex flex-col">
                <div>{{ user.nickname }}</div>
                <small class="text-gray-400">{{ user.email }}</small>
              </div>
              <div>
                <button
                  class="btn btn-circle btn-ghost fa-solid fa-xmark"
                  type="button"
                  :aria-label="'Remove request of: ' + user"
                  @click="rejectRequest(user)"
                ></button>
                <button
                  class="btn btn-circle btn-ghost fa-solid fa-plus"
                  type="button"
                  :aria-label="'Accept request of: ' + user"
                  @click="approveRequest(user)"
                ></button>
              </div>
            </li>
          </ul>
          <div
            v-if="unregisteredUsers?.length === 0"
            class="flex text-center text-gray-500 justify-center items-center min-h-[20vh]"
          >
            <p class="text-2xl">No registration requests...</p>
          </div>
        </div>
      </div>
    </div>
  </NavbarLayout>
</template>

<style></style>
