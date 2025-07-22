import type { GetTypeDTO } from '../GetTypeDTO'
import { isGetConditionDTO, type GetConditionDTO } from './GetConditionDTO'
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

function isGetSendNotificationInstructionDTO(o: unknown): o is GetSendNotificationInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'email' in o && typeof o.email === 'string' &&
    'message' in o && typeof o.message === 'string'
}

function isGetWaitInstructionDTO(o: unknown): o is GetWaitInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'seconds' in o && typeof o.seconds === 'number'
}

function isGetStartTaskInstructionDTO(o: unknown): o is GetStartTaskInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'taskId' in o && typeof o.taskId === 'string'
}

function isGetDeviceActionInstructionDTO(o: unknown): o is GetDeviceActionInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'deviceId' in o && typeof o.deviceId === 'string' &&
    'deviceActionId' in o && typeof o.deviceActionId === 'string' &&
    'input' in o
}

function isGetCreateConstantInstructionDTO(o: unknown): o is GetCreateConstantInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'name' in o && typeof o.name === 'string' &&
    'type' in o && typeof o.type === 'string' &&
    'value' in o
}

function isGetCreateDevicePropertyConstantInstructionDTO(o: unknown): o is GetCreateDevicePropertyConstantInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'name' in o && typeof o.name === 'string' &&
    'type' in o && typeof o.type === 'string' &&
    'deviceId' in o && typeof o.deviceId === 'string' &&
    'devicePropertyId' in o && typeof o.devicePropertyId === 'string'
}

function isIfInstructionDTO(o: unknown): o is GetIfInstructionDTO {
  return o != undefined &&
    typeof o === 'object' &&
    'thenInstructions' in o && Array.isArray(o.thenInstructions) &&
    'condition' in o && isGetConditionDTO(o.condition)
}


function isGetIfElseInstructionDTO(o: unknown): o is GetIfElseInstructionDTO {
  return isIfInstructionDTO(o) &&
    'elseInstructions' in o && Array.isArray(o.elseInstructions)
}


