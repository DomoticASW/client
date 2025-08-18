<template>
  <NavbarLayout title="Manage users permissions">
    <div v-if="users?.length === 0" class="flex text-center text-gray-500 justify-center items-center min-h-[50vh]">
      <p class="text-2xl">No users yet...</p>
    </div>
    <ul class="list rounded-box" v-if="users">
      <li class="list-row" v-for="user in users" :key="user.email">
        <div class="list-col-grow flex items-center">
          {{ user.nickname }}
        </div>
        <RouterLink
          class="btn btn-circle btn-ghost"
          :to="{ name: 'user-permissions', params: { id: user.email }, state: { nickname: user.nickname } }"
          :aria-label="'Get permissions of: ' + user.nickname"
        >
          <i class="fa-solid fa-play"></i>
        </RouterLink>
      </li>
    </ul>
    <UsersListSkeleton v-else />
  </NavbarLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import { Role, type User } from '@/model/users-management/User';
import * as api from '@/api/users-management/requests/users';
import NavbarLayout from '@/components/NavbarLayout.vue';
import UsersListSkeleton from '@/components/admin/users-permissions/UsersListSkeleton.vue'

const users = ref<User[] | undefined>(undefined);

const loadUsers = async () => {
  const userInfoStore = useUserInfoStore();
  const adminToken = userInfoStore.token;

  const usersList = await api.getAllUsers(adminToken);
  users.value = usersList.filter(user => user.role !== Role.Admin);
};

onMounted(() => {
  loadUsers();
});
</script>
