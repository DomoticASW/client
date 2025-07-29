import { authorizedRequest, deserializeBody } from '@/api/api'
import type { TaskId } from '@/model/scripts/Script'
import { taskDeserializer, tasksDeserializer } from '../dtos/GetTaskDTO'

export async function findTask(id: TaskId, token: string) {
  const res = await authorizedRequest('/api/tasks/' + id, token)
  return await deserializeBody(res, taskDeserializer)
}

export async function getAllTasks(token: string) {
  const res = await authorizedRequest('/api/tasks', token)
  return await deserializeBody(res, tasksDeserializer)
}
