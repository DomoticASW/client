import type { EditList } from '@/model/permissions-management/EditList'
import { Deserializer } from '../Deserializer'

export interface GetEditListDTO {
  id: string
  users: string[]
}

export function isGetEditListDTO(o: unknown): o is GetEditListDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'id' in o &&
    typeof o.id == 'string' &&
    'users' in o &&
    Array.isArray(o.users) &&
    o.users.every((user) => typeof user == 'string')
  )
}

export const deviceDeserializer = Deserializer<GetEditListDTO, EditList>(
  isGetEditListDTO,
  (dto) => {
    return {
      id: dto.id,
      users: dto.users,
    }
  },
)
