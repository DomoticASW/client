import type { Task } from '@/model/scripts/Script.js'
import { arrayDeserializer, Deserializer } from '../Deserializer.js'
import {
  instructionsDeserializer,
  isGetInstructionDTO,
  type GetInstructionDTO,
} from './GetInstructionDTO.js'

export interface GetTaskDTO {
  id: string
  name: string
  instructions: GetInstructionDTO[]
}

function isGetTaskDTO(o: unknown): o is GetTaskDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'id' in o &&
    typeof o.id === 'string' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'instructions' in o &&
    Array.isArray(o.instructions) &&
    o.instructions.every((instruction) => isGetInstructionDTO(instruction))
  )
}

export const taskDeserializer = Deserializer<GetTaskDTO, Task>(isGetTaskDTO, (dto) => {
  return {
    id: dto.id,
    name: dto.name,
    instructions: instructionsDeserializer(dto.instructions),
  }
})

export const tasksDeserializer = arrayDeserializer(taskDeserializer)
