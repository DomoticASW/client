import { type RegistrationRequest } from "@/model/users-management/RegistrationRequest"
import { arrayDeserializer, Deserializer } from "../Deserializer"

export interface RegistrationRequestDTO {
  nickname: string;
  email: string;
  passwordHash: string;
}

export function isRegistrationRequestDTO(o: unknown): o is RegistrationRequestDTO {
  return o != undefined && typeof o == "object" &&
    "nickname" in o && typeof o.nickname == "string" &&
    "email" in o && typeof o.email == "string" &&
    "passwordHash" in o && typeof o.passwordHash == "string"
}

export const registrationRequestDeserializer =
  Deserializer<RegistrationRequestDTO, RegistrationRequest>(
    isRegistrationRequestDTO,
    (dto) => ({
      nickname: dto.nickname,
      email: dto.email,
      passwordHash: dto.passwordHash,
    }),
    (obj) => `Unable to deserialize ${obj} into a RegistrationRequest since it was not a RegistrationRequestDTO`
  )

export const registrationRequestsDeserializer = arrayDeserializer(registrationRequestDeserializer)
