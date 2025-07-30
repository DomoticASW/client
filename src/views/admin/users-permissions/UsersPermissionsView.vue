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
          <i class="fa-solid fa-play"></i>
        </a>
      </RouterLink>
    </li>
  </ul>
</template>

<style></style>
