import { type GetInstructionDTO } from './GetInstructionDTO.js'

export interface GetTaskDTO {
  id: string
  name: string
  instructions: GetInstructionDTO[]
}
