import { defineStore } from "pinia";
import { type UserInfo } from '@/model/users-management/User';
import { isGetUserInfoDTO } from '@/api/users-management/dtos/GetUserInfoDTO';

export const useUserInfoStore = defineStore('user-info', {
  state: () => ({
    userInfo: {} as UserInfo
  }),
  getters: {
    email: (state) => state.userInfo.email,
    nickname: (state) => state.userInfo.nickname,
    token: (state) => state.userInfo.token,
    role: (state) => state.userInfo.role,
  },
  actions: {
    setUserInfo(info: UserInfo) {
      if (!isGetUserInfoDTO(info)) {
        throw new Error("Invalid user info format");
      }
      this.userInfo = info;
      localStorage.setItem('userInfo', JSON.stringify(info));
    },
    setNickname(nickname: string) {
      this.userInfo.nickname = nickname;
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
    },
    clearUserInfo() {
      this.userInfo = {} as UserInfo;
      localStorage.removeItem('userInfo');
    },
    loadFromStorage() {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (isGetUserInfoDTO(parsed)) {
            this.userInfo = parsed;
          }
        } catch (e) {
          console.error("Failed to parse stored user info", e);
        }
      }
    }
  },
})
