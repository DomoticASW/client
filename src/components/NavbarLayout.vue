<template>
  <div class="navbar bg-base-300 shadow mb-4">
    <div class="navbar-start">
      <template v-if="showBackButton">
        <button
          type="button"
          class="btn btn-ghost fa-arrow-left fa-solid fa-xl !flex"
          @click="goBack()"
        >
        </button>
      </template>
      <template v-else>
        <div class="dropdown">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost lg:hidden! fa-bars fa-solid fa-xl !flex"
          ></div>
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-300 -ml-2 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li><RouterLink :to="{ name: 'devices' }">Devices</RouterLink></li>
            <li><RouterLink :to="{ name: 'tasks' }">Tasks</RouterLink></li>
            <li><RouterLink :to="{ name: 'automations' }">Automations</RouterLink></li>
            <li><RouterLink :to="{ name: 'settings' }">Settings</RouterLink></li>
            <li v-if="userInfo.role === Role.Admin">
              <p>Admin</p>
              <ul class="p-2">
                <li><RouterLink :to="{ name: 'manage-users' }">Users</RouterLink></li>
                <li><RouterLink :to="{ name: 'manage-devices' }">Devices</RouterLink></li>
                <li><RouterLink :to="{ name: 'device-groups' }">Device groups</RouterLink></li>
                <li><RouterLink :to="{ name: 'manage-users-permissions' }">Users permissions</RouterLink></li>
                <li><RouterLink :to="{ name: 'automations-and-tasks-permissions' }">Scripts permissions</RouterLink></li>
              </ul>
            </li>
          </ul>
        </div>
      </template>
      <h1 class="text-xl font-bold ml-4" :class="{ 'skeleton h-4 w-1/2': !title }">{{ title }}</h1>
    </div>
    <template v-if="!showBackButton">
      <div class="navbar-center hidden lg:block">
        <ul class="menu menu-horizontal px-1 text-base">
          <li><RouterLink :to="{ name: 'devices' }">Devices</RouterLink></li>
          <li><RouterLink :to="{ name: 'tasks' }">Tasks</RouterLink></li>
          <li><RouterLink :to="{ name: 'automations' }">Automations</RouterLink></li>
          <li><RouterLink :to="{ name: 'settings' }">Settings</RouterLink></li>
          <li v-if="userInfo.role === Role.Admin">
            <details>
              <summary>Admin</summary>
              <ul class="p-2 bg-base-300 w-40 z-1">
                <li><RouterLink :to="{ name: 'manage-users' }">Users</RouterLink></li>
                <li><RouterLink :to="{ name: 'manage-devices' }">Devices</RouterLink></li>
                <li><RouterLink :to="{ name: 'device-groups' }">Device groups</RouterLink></li>
                <li><RouterLink :to="{ name: 'manage-users-permissions' }">Users permissions</RouterLink></li>
                <li><RouterLink :to="{ name: 'automations-and-tasks-permissions' }">Scripts permissions</RouterLink></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </template>
    <div class="navbar-end">
      <slot name="actions" />
      <slot name="logout" />
    </div>
  </div>
  <div class="w-full max-w-xl mx-auto">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
import { Role } from '@/model/users-management/User'
import { useRouter } from 'vue-router'

defineProps({
  title: { type: String},
  showBackButton: {
    type: Boolean,
    default: false,
  },
  showLogoutButton: {
    type: Boolean,
    default: false,
  },
})

const userInfo = useUserInfoStore()
const router = useRouter()
const goBack = () => router.back()
</script>
