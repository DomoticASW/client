import { authorizedRequest, deserializeBody } from '@/api/api'
import type { TaskId } from '@/model/scripts/Script'
import { taskDeserializer, tasksDeserializer } from '../dtos/GetTaskDTO'
import type { Instruction } from '@/model/scripts/Instruction'

export async function editTask(
  id: TaskId,
  task: { name: string; instructions: Instruction[] },
  token: string,
): Promise<void> {
  await authorizedRequest('/api/tasks/' + id, token, {
    method: 'PATCH',
    body: JSON.stringify({
      name: task.name,
      instructions: task.instructions,
    }),
  })
}

export async function createTask(
  task: { name: string; instructions: Instruction[] },
  token: string,
): Promise<void> {
  await authorizedRequest('/api/tasks/', token, {
    method: 'POST',
    body: JSON.stringify({
      name: task.name,
      instructions: task.instructions,
    }),
  })
}

export async function deleteTask(id: TaskId, token: string): Promise<void> {
  await authorizedRequest('/api/tasks/' + id, token, { method: 'DELETE' })
}

export async function executeTask(id: TaskId, token: string): Promise<void> {
  await authorizedRequest('api/tasks/' + id + '/execute', token, { method: 'POST' })
}

export async function findTask(id: TaskId, token: string) {
  const res = await authorizedRequest('/api/tasks/' + id, token)
  return await deserializeBody(res, taskDeserializer)
}

export async function getAllTasks(token: string) {
  const res = await authorizedRequest('/api/tasks', token)
  return await deserializeBody(res, tasksDeserializer)
}
