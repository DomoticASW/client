import { defineStore } from 'pinia'
import { useUserInfoStore } from './user-info'
import { ref } from 'vue'
import type { User } from '@/model/users-management/User'
import { getAllUsers } from '@/api/users-management/requests/users'

export const useUsersStore = defineStore('users', () => {
  const userInfo = useUserInfoStore()
  const users = ref<User[]>([])

  async function updateUsers() {
    users.value = await getAllUsers(userInfo.token)
  }

  function getUser(email: string) {
    return users.value?.find((u) => u.email === email)
  }

  return { users, updateUsers, getUser }
})
