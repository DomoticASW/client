import type { GetTypeDTO } from '../GetTypeDTO'
import type { GetConditionDTO } from './GetConditionDTO'
import type { GetInstructionTypeDTO } from './GetInstructionTypeDTO'

export interface GetInstructionDTO {
  type: GetInstructionTypeDTO
  instruction:
    | GetSendNotificationInstructionDTO
    | GetWaitInstructionDTO
    | GetStartTaskInstructionDTO
    | GetDeviceActionInstructionDTO
    | GetCreateConstantInstructionDTO
    | GetCreateDevicePropertyConstantInstructionDTO
    | GetIfInstructionDTO
    | GetIfElseInstructionDTO
}

interface GetSendNotificationInstructionDTO {
  email: string
  message: string
}

interface GetWaitInstructionDTO {
  seconds: number
}

interface GetStartTaskInstructionDTO {
  taskId: string
}

interface GetDeviceActionInstructionDTO {
  deviceId: string
  deviceActionId: string
  input: unknown
}

interface GetConstantInstructionDTO {
  name: string
  type: GetTypeDTO
}

interface GetCreateConstantInstructionDTO extends GetConstantInstructionDTO {
  value: unknown
}

interface GetCreateDevicePropertyConstantInstructionDTO extends GetConstantInstructionDTO {
  deviceId: string
  devicePropertyId: string
}

interface GetIfInstructionDTO {
  thenInstructions: GetInstructionDTO[]
  condition: GetConditionDTO
}

interface GetIfElseInstructionDTO extends GetIfInstructionDTO {
  elseInstructions: GetInstructionDTO[]
}


