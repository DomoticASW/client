import { defineStore } from 'pinia'
import { useUserInfoStore } from './user-info'
import type { RegistrationRequest } from '@/model/users-management/RegistrationRequest'
import { getAllRegistrationRequests } from '@/api/users-management/requests/users'
import { ref } from 'vue'

export const useRegistrationRequestsStore = defineStore('registrationRequests', () => {
  const userInfo = useUserInfoStore()
  const registrationRequests = ref<RegistrationRequest[] | undefined>()

  async function updateRegistrationRequests() {
    registrationRequests.value = await getAllRegistrationRequests(userInfo.token)
  }

  function removeRequest(req: RegistrationRequest) {
    registrationRequests.value = registrationRequests.value?.filter((u) => u.email !== req.email)
  }

  return { registrationRequests, updateRegistrationRequests, removeRequest }
})
