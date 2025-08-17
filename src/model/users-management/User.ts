export interface User {
  nickname: string
  email: string
  role: Role
}

export interface UserInfo extends User {
  token: string
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
}
