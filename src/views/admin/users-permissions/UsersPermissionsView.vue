<template>
  <h1 class="text-3xl font-bold my-2">Manage users permissions</h1>
  <ul class="list rounded-box">
    <li class="list-row" v-for="user in users" :key="user.email">
      <div class="list-col-grow flex items-center">
        {{ user.nickname }}
      </div>
      <button
        class="btn btn-circle btn-ghost"
        type="button"
        :aria-label="'Get permissions of: ' + user.nickname"
        @click="goToPermissions(user)"
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
    </li>
  </ul>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import { Role, type User } from '@/model/users-management/User';
import * as api from '@/api/users-management/requests/users';

const users = ref<User[]>([]);

const loadUsers = async () => {
  const userInfoStore = useUserInfoStore();
  const adminToken = userInfoStore.token;

  const usersList = await api.getAllUsers(adminToken);
  users.value = usersList.filter(user => user.role !== Role.Admin);
};

const goToPermissions = (user: User): void => {
  router.push({
    path: `./${user.email}`,
    state: { 
      nickname: user.nickname,
      email: user.email
    }
  });
};

onMounted(() => {
  loadUsers();
});
</script>
