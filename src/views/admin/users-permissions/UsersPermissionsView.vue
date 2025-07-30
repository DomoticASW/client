<template>
  <h1 class="text-3xl font-bold my-2">Manage user permissions</h1>
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

<script lang="ts">
import router from '@/router';
import { defineComponent, ref, onMounted } from 'vue';
import { useUserInfoStore } from '@/stores/user-info';
import { type User } from '@/model/users-management/User';

export default defineComponent({
  name: 'UsersPermissionsView',
  setup() {
    const users = ref<User[]>([]);

    const loadUsers = async () => {
      try {
        const userInfoStore = useUserInfoStore();
        userInfoStore.loadFromStorage();
        const adminToken = userInfoStore.token;
        
        const getUsersResponse = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': adminToken
          }
        });

        if (getUsersResponse.ok) {
          const fetchedUsers = await getUsersResponse.json();
          users.value = fetchedUsers;
        } else {
          console.error('Failed to fetch users:', getUsersResponse.status);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
      }
    };

    onMounted(() => {
      loadUsers();
    });

    return {
      users
    };
  },
  methods: {
    goToPermissions(user: User): void {
      router.push(`./users-permissions/${user.email}`)
    }
  }
})
</script>
