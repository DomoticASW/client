import type { GetTypeDTO } from '../GetTypeDTO'
import type { GetInstructionTypeDTO } from './GetInstructionTypeDTO'

export interface GetInstructionDTO {
  type: GetInstructionTypeDTO
  instruction:
    | GetSendNotificationInstructionDTO
    | GetWaitInstructionDTO
    | GetStartTaskInstructionDTO
    | GetDeviceActionInstructionDTO
    | GetCreateConstantInstructionSchema
    | GetCreateDevicePropertyConstantInstructionSchema
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

interface GetCreateConstantInstructionSchema extends GetConstantInstructionDTO {
  value: unknown
}

interface GetCreateDevicePropertyConstantInstructionSchema extends GetConstantInstructionDTO {
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

interface GetConditionDTO {
  leftConstantName: string
  rightConstantName: string
  negate: boolean
  conditionOperatorType: GetConditionOperatorTypeDTO
}

enum GetConditionOperatorTypeDTO {
  NumberEOperator = 'NumberEOperator',
  NumberGEOperator = 'NumberGEOperator',
  NumberLEOperator = 'NumberLEOperator',
  NumberLOperator = 'NumberLOperator',
  NumberGOperator = 'NumberGOperator',
  StringEOperator = 'StringEOperator',
  ColorEOperator = 'ColorEOperator',
  BooleanEOperator = 'BooleanEOperator',
}


