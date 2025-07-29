<script setup lang="ts">
import { authorizedRequest, deserializeBody } from '@/api/api'
import { usersDeserializer } from '@/api/users-management/GetUserDTO'
import type { User } from '@/model/users-management/User'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const userInfo = useUserInfoStore()
const users = ref<User[]>()

onMounted(async () => {
  const res = await authorizedRequest(`/api/users`, userInfo.token)
  users.value = await deserializeBody(res, usersDeserializer)
})
</script>

<template>
  <ul class="list rounded-box">
    <li class="list-row" v-for="user in users" :key="user.email">
      <div class="list-col-grow flex items-center">
        {{ user.nickname }}
      </div>
      <RouterLink :to="{ name: 'user-permission', params: { id: user.email } }">
        <a
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
        </a>
      </RouterLink>
    </li>
  </ul>
</template>

<style></style>
