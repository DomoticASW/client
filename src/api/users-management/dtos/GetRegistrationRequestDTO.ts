import { type RegistrationRequest } from "@/model/users-management/RegistrationRequest"
import { Deserializer } from "../../Deserializer"

export interface GetRegistrationRequestDTO {
  nickname: string;
  email: string;
  passwordHash: string;
}

export function isGetRegistrationRequestDTO(o: unknown): o is GetRegistrationRequestDTO {
  return o != undefined && typeof o == "object" &&
    "nickname" in o && typeof o.nickname == "string" &&
    "email" in o && typeof o.email == "string" &&
    "passwordHash" in o && typeof o.passwordHash == "string"
}

export const registrationRequestDeserializer =
  Deserializer<GetRegistrationRequestDTO, RegistrationRequest>(
    isGetRegistrationRequestDTO,
    (dto) => ({
      nickname: dto.nickname,
      email: dto.email,
      password: dto.passwordHash,
    }),
    (obj) => `Unable to deserialize ${obj} into a RegistrationRequest since it was not a GetRegistrationRequestDTO`
  )
  