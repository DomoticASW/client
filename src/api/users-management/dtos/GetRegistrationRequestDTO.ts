import { type RegistrationRequest } from "@/model/users-management/RegistrationRequest"
import { Deserializer } from "../../Deserializer"

export interface GetRegistrationRequestDTO {
  nickname: string;
  email: string;
}

export function isGetRegistrationRequestDTO(o: unknown): o is GetRegistrationRequestDTO {
  return o != undefined && typeof o == "object" &&
    "nickname" in o && typeof o.nickname == "string" &&
    "email" in o && typeof o.email == "string"
}

export const registrationRequestDeserializer =
  Deserializer<GetRegistrationRequestDTO, RegistrationRequest>(
    isGetRegistrationRequestDTO,
    (dto) => ({
      nickname: dto.nickname,
      email: dto.email,
    }),
    (obj) => `Unable to deserialize ${obj} into a RegistrationRequest since it was not a GetRegistrationRequestDTO`
  )
  