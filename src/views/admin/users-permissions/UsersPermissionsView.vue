<script setup lang="ts">
import { useUserInfoStore, type UserInfo } from '@/stores/user-info'
import { authorizedRequest } from '@/utils'
import { ref } from 'vue'

const userInfo = useUserInfoStore()
const users = ref<UserInfo[] | undefined>(undefined)
authorizedRequest('/api/users', userInfo.token).then(({ json }) => {
  users.value = json as UserInfo[]
})
</script>

<template>
  <ul class="list rounded-box">
    <li class="list-row" v-for="user in users" :key="user.email">
      <div class="list-col-grow flex items-center">
        {{ user.nickname }}
      </div>
      <RouterLink :to="{ name: 'user-permission', params: { id: user.email } }">
        <button
          class="btn btn-circle btn-ghost"
          type="button"
          :aria-label="'Get permissions of: ' + user.nickname"
        >
          <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M6 3L20 12 6 21 6 3z"></path>
            </g>
          </svg>
        </button>
      </RouterLink>
    </li>
  </ul>
</template>

<style></style>
