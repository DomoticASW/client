import type { TaskList } from '@/model/permissions-management/TaskList'
import { Deserializer } from '../Deserializer'

export interface GetTaskListDTO {
  id: string
  blacklist: string[]
  whitelist: string[]
}

export function isGetTaskListDTO(o: unknown): o is GetTaskListDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'id' in o &&
    typeof o.id == 'string' &&
    'blacklist' in o &&
    Array.isArray(o.blacklist) &&
    o.blacklist.every((email) => typeof email == 'string') &&
    'whitelist' in o &&
    Array.isArray(o.whitelist) &&
    o.whitelist.every((email) => typeof email == 'string')
  )
}

export const TaskListDeserializer = Deserializer<GetTaskListDTO, TaskList>(
  isGetTaskListDTO,
  (dto) => {
    return {
      id: dto.id,
      blacklist: dto.blacklist,
      whitelist: dto.whitelist,
    }
  },
)
