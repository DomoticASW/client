import { Role, type UserInfo } from "@/model/users-management/User"
import { Deserializer } from "../Deserializer"
import { isRole } from "./GetUserDTO";

export interface UserInfoDTO { 
  nickname: string;
  email: string;
  role: Role;
  token: string;
}

export function isUserInfoDTO(o: unknown): o is UserInfoDTO {
  return o != undefined && typeof o == "object" &&
    "nickname" in o && typeof o.nickname == "string" &&
    "email" in o && typeof o.email == "string" &&
    "role" in o && isRole(o.role) &&
    "token" in o && typeof o.token == "string";
}

export const userDeserializer =
  Deserializer<UserInfoDTO, UserInfo>(
    isUserInfoDTO,
    (dto) => ({
      nickname: dto.nickname,
      email: dto.email,
      role: dto.role,
      token: dto.token
    }),
    (obj) => `Unable to deserialize ${obj} into a User since it was not a UserInfoDTO`
  )
