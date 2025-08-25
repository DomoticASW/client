<template>
  <NavbarLayout title="Manage users permissions">
    <div v-if="users?.length === 0" class="flex text-center text-gray-500 justify-center items-center min-h-[50vh]">
      <p class="text-2xl">No users yet...</p>
    </div>
    <ul class="list rounded-box" v-if="users">
      <RouterLink
        v-for="user in users" :key="user.email"
        :to="{ name: 'user-permissions', params: { id: user.email }, state: { nickname: user.nickname } }"
        :aria-label="'Get permissions of: ' + user.nickname"
      >
        <li class="list-row hover:bg-primary/20">
          <span class="fa-solid fa-user text-xl self-center"></span>
          {{ user.nickname }}
          <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
        </li>
      </RouterLink>
    </ul>
    <ListSkeleton v-else />
  </NavbarLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import { Role, type User } from '@/model/users-management/User';
import * as api from '@/api/users-management/requests/users';
import NavbarLayout from '@/components/NavbarLayout.vue';
import ListSkeleton from '@/components/ListSkeleton.vue'

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
