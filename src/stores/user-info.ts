import { defineStore } from "pinia";

// TODO: substitute in favor of a proper domain model enum
export enum UserRole {
  Admin = "Admin",
  User = "User"
}
export interface UserInfo {
  email: string,
  nickname: string,
  token: string,
  role: UserRole,
}
export function isUserInfo(a: unknown): a is UserInfo {
  return typeof a === "object" && a != null &&
    "email" in a && typeof a.email === "string" &&
    "nickname" in a && typeof a.nickname === "string" &&
    "token" in a && typeof a.token === "string" &&
    "role" in a && typeof a.role === "string" &&
    Object.values(UserRole).includes(a.role as UserRole);
}

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
      if (!isUserInfo(info)) {
        throw new Error("Invalid user info format");
      }
      this.userInfo = info;
      // Optionally save to localStorage for persistence
      localStorage.setItem('userInfo', JSON.stringify(info));
    },
    clearUserInfo() {
      this.userInfo = {} as UserInfo;
      localStorage.removeItem('userInfo');
    },
    // Call this during app initialization to load persisted user info
    loadFromStorage() {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (isUserInfo(parsed)) {
            this.userInfo = parsed;
          }
        } catch (e) {
          console.error("Failed to parse stored user info", e);
        }
      }
    }
  },
})
