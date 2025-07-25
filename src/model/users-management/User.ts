import type { RegistrationRequest } from "./RegistrationRequest";

export interface BasicUser {
  nickname: string;
  email: string;
  role: Role;
}

export interface User extends RegistrationRequest {
  passwordHash: string;
}

export interface UserInfo extends BasicUser {
  token: string;
}

export enum Role {
  Admin = "Admin",
  User = "User"
}
