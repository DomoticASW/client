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
  actions: {},
})
