import { type RegistrationRequestDTO } from "./GetRegistrationRequestDTO";
import { Role, type User } from "@/model/users-management/User"
import { Deserializer } from "../Deserializer"

export interface UserDTO extends RegistrationRequestDTO {
  role: Role;
}

export function isUserDTO(o: unknown): o is UserDTO {
  return o != undefined && typeof o == "object" &&
    "nickname" in o && typeof o.nickname == "string" &&
    "email" in o && typeof o.email == "string" &&
    "passwordHash" in o && typeof o.passwordHash == "string" &&
    "role" in o && isRole(o.role)
}

export function isRole(value: unknown): value is Role {
  return Object.values(Role).includes(value as Role);
}

export const userDeserializer =
  Deserializer<UserDTO, User>(
    isUserDTO,
    (dto) => ({
      nickname: dto.nickname,
      email: dto.email,
      passwordHash: dto.passwordHash,
      role: dto.role
    }),
    (obj) => `Unable to deserialize ${obj} into a User since it was not a UserDTO`
  )
