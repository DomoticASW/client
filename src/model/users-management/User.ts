export interface BasicUser {
  nickname: string;
  email: string;
  role: Role;
}

export interface User extends BasicUser {
  passwordHash: string;
}

export interface UserInfo extends BasicUser {
  token: string;
}

export enum Role {
  Admin = "Admin",
  User = "User"
}
