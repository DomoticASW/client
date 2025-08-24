<template>
  <div class="navbar bg-base-300 shadow mb-4 lg:rounded-xl md:mt-1">
    <div class="navbar-start">
      <template v-if="showBackButton">
        <button
          type="button"
          class="btn btn-ghost fa-arrow-left fa-solid fa-xl !flex"
          @click="goBack()"
        ></button>
      </template>
      <template v-else>
        <div class="dropdown">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost md:hidden! fa-bars fa-solid fa-xl !flex"
          ></div>
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-300 -ml-2 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li><RouterLink :to="{ name: 'devices' }">Devices</RouterLink></li>
            <li><RouterLink :to="{ name: 'tasks' }">Tasks</RouterLink></li>
            <li><RouterLink :to="{ name: 'automations' }">Automations</RouterLink></li>
            <li v-if="userInfo.role === Role.Admin">
              <p>Admin</p>
              <ul class="p-2">
                <li>
                  <RouterLink :to="{ name: 'manage-users' }">
                    Users
                    <div
                      class="inline-grid *:[grid-area:1/1] h-full items-center mt-1"
                      v-if="registrationRequests.length > 0"
                    >
                      <div class="status status-error animate-ping"></div>
                      <div class="status status-error"></div>
                    </div>
                  </RouterLink>
                </li>
                <li><RouterLink :to="{ name: 'manage-devices' }">Devices</RouterLink></li>
                <li><RouterLink :to="{ name: 'device-groups' }">Device groups</RouterLink></li>
                <li>
                  <RouterLink :to="{ name: 'manage-users-permissions' }"
                    >Users permissions</RouterLink
                  >
                </li>
                <li>
                  <RouterLink :to="{ name: 'automations-and-tasks-permissions' }"
                    >Scripts permissions</RouterLink
                  >
                </li>
              </ul>
            </li>
            <li><RouterLink :to="{ name: 'settings' }">Settings</RouterLink></li>
            <li>
              <RouterLink :to="{ name: 'notifications' }">
                Notifications
                <div class="badge badge-primary badge-xs">
                  {{ useNotificationsStore().unreadNotifications() }}
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </template>
      <h1 class="text-xl font-bold ml-4" :class="{ 'skeleton h-4 w-1/2': !title }">{{ title }}</h1>
    </div>
    <template v-if="!showBackButton">
      <div class="navbar-center hidden md:block">
        <ul class="menu menu-horizontal px-1 text-base">
          <li><RouterLink :to="{ name: 'devices' }">Devices</RouterLink></li>
          <li><RouterLink :to="{ name: 'tasks' }">Tasks</RouterLink></li>
          <li><RouterLink :to="{ name: 'automations' }">Automations</RouterLink></li>
          <li v-if="userInfo.role === Role.Admin">
            <details>
              <summary>
                Admin
                <div
                  class="inline-grid *:[grid-area:1/1] h-full items-center mt-1"
                  v-if="registrationRequests.length > 0"
                >
                  <div class="status status-error animate-ping"></div>
                  <div class="status status-error"></div>
                </div>
              </summary>

              <ul class="p-2 bg-base-300 w-40 z-1">
                <li>
                  <RouterLink :to="{ name: 'manage-users' }">
                    Users
                    <div
                      class="inline-grid *:[grid-area:1/1] h-full items-center mt-1"
                      v-if="registrationRequests.length > 0"
                    >
                      <div class="status status-error animate-ping"></div>
                      <div class="status status-error"></div>
                    </div>
                  </RouterLink>
                </li>
                <li><RouterLink :to="{ name: 'manage-devices' }">Devices</RouterLink></li>
                <li><RouterLink :to="{ name: 'device-groups' }">Device groups</RouterLink></li>
                <li>
                  <RouterLink :to="{ name: 'manage-users-permissions' }"
                    >Users permissions</RouterLink
                  >
                </li>
                <li>
                  <RouterLink :to="{ name: 'automations-and-tasks-permissions' }"
                    >Scripts permissions</RouterLink
                  >
                </li>
              </ul>
            </details>
          </li>
          <li><RouterLink :to="{ name: 'settings' }">Settings</RouterLink></li>
          <li>
            <RouterLink :to="{ name: 'notifications' }">
              Notifications
              <div class="badge badge-primary badge-sm">
                {{ useNotificationsStore().unreadNotifications() }}
              </div>
            </RouterLink>
          </li>
        </ul>
      </div>
    </template>
    <div class="navbar-end">
      <slot name="actions" />
    </div>
  </div>
  <div class="w-full max-w-xl mx-auto">
    <div class="ml-2 md:ml-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
import { Role } from '@/model/users-management/User'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import type { RegistrationRequest } from '@/model/users-management/RegistrationRequest'
import { onMounted, ref } from 'vue'
import { getAllRegistrationRequests } from '@/api/users-management/requests/users'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'

defineProps({
  title: { type: String },
  showBackButton: {
    type: Boolean,
    default: false,
  },
})

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const router = useRouter()
const goBack = () => router.back()

const registrationRequests = ref<RegistrationRequest[]>([])

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    registrationRequests.value = await getAllRegistrationRequests(userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
})
</script>
