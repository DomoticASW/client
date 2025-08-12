import { defineStore } from "pinia";
import { type UserInfo } from '@/model/users-management/User';
import { isGetUserInfoDTO } from '@/api/users-management/dtos/GetUserInfoDTO';
import { computed, ref } from "vue";

export const useUserInfoStore = defineStore('user-info', () => {
  const userInfo = ref<UserInfo>({} as UserInfo)
  const stored = localStorage.getItem('userInfo');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (isGetUserInfoDTO(parsed)) {
        userInfo.value = parsed;
      }
    } catch (e) {
      console.error("Failed to parse stored user info", e);
    }
  }

  const email = computed(() => userInfo.value.email)
  const nickname = computed(() => userInfo.value.nickname)
  const token = computed(() => userInfo.value.token)
  const role = computed(() => userInfo.value.role)

  function setUserInfo(info: UserInfo) {
    if (!isGetUserInfoDTO(info)) {
      throw new Error("Invalid user info format");
    }
    userInfo.value = info;
    localStorage.setItem('userInfo', JSON.stringify(info));
  }
  function setNickname(nickname: string) {
    userInfo.value.nickname = nickname;
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
  }
  function clearUserInfo() {
    userInfo.value = {} as UserInfo;
    localStorage.removeItem('userInfo');
  }
  return { userInfo, email, nickname, token, role, setUserInfo, setNickname, clearUserInfo }
})
