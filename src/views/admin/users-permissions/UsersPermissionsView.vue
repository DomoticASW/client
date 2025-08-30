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
    <template #actions>
    <button
      class="fa-circle-info fa-solid fa-xl btn btn-ghost btn-circle"
      onclick="permissions_info.showModal()"
    ></button>
  </template>
  <dialog id="permissions_info" class="modal modal-sm">
      <div class="modal-box max-w-sm">
        <h2 class="card-title mb-2">Users permissions info</h2>
        <p>
          On this page, the list of registered users is shown.
        </p>
        <p>
          By clicking on a user, you are shown a list of device permissions that you can add or remove for the selected user.
          The device permission allows the user to use that device.
        </p>
        <p>
          When a user has all the device permissions required by a task, he can execute it.
        </p>
        <p>
          You are not showed in these lists since you already have every permission to execute every device.
        </p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>Ok</button>
      </form>
    </dialog>
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
