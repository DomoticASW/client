import { Role, type User } from '@/model/users-management/User';
import { isUserDTO } from './GetUserDTO';
import { Deserializer } from "../Deserializer"

export interface GetRegistrationRequestsDTO {
  users: User[];
}

export function isGetRegistrationRequestsDTO(o: unknown): o is GetRegistrationRequestsDTO {
  return o != undefined && typeof o === 'object' &&
    'users' in o && Array.isArray(o.users) &&
    o.users.every(user => isUserDTO(user));
}

export const getRegistrationRequestsDeserializer = 
  Deserializer<GetRegistrationRequestsDTO, GetRegistrationRequestsDTO>(
    isGetRegistrationRequestsDTO,
    (dto) => ({
        users: dto.users
    }),
    (obj) => `Unable to deserialize ${obj} into a GetRegistrationRequestsDTO since it was not a valid GetRegistrationRequestsDTO`
  )
