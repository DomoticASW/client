import { type User } from '@/model/users-management/User';
import { isGetUserDTO } from './GetUserDTO';
import { Deserializer } from "../Deserializer"

export interface GetUsersDTO {
  users: User[];
}

export function isGetUsersDTO(o: unknown): o is GetUsersDTO {
  return o != undefined && typeof o === 'object' &&
    'users' in o && Array.isArray(o.users) &&
    o.users.every(user => isGetUserDTO(user));
}

export const getUsersDeserializer = 
  Deserializer<GetUsersDTO, GetUsersDTO>(
    isGetUsersDTO,
    (dto) => ({
        users: dto.users
    }),
    (obj) => `Unable to deserialize ${obj} into a GetUsersDTO since it was not a valid GetUsersDTO`
  )
