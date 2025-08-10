import type {
  CreateConstantInstruction,
  CreateDevicePropertyConstantInstruction,
  DeviceActionInstruction,
  IfElseInstruction,
  IfInstruction,
  Instruction,
  RealInstruction,
  SendNotificationInstruction,
  StartTaskInstruction,
  WaitInstruction,
} from '@/model/scripts/Instruction'
import { arrayDeserializer, Deserializer } from '../../Deserializer'
import { conditionDeserializer, isGetConditionDTO, type GetConditionDTO } from './GetConditionDTO'
import {
  instructionTypeDeserializer,
  isGetInstructionTypeDTO,
  type GetInstructionTypeDTO,
} from './GetInstructionTypeDTO'
import { isTypeDTO, typeDeserializer, type TypeDTO } from '@/api/devices-management/dtos/devices/TypeDTO'
import { DeviceActionId, DeviceId, DevicePropertyId } from '@/model/devices-management/Device'

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
  type: TypeDTO
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
  return (
    o != undefined &&
    typeof o === 'object' &&
    'email' in o &&
    typeof o.email === 'string' &&
    'message' in o &&
    typeof o.message === 'string'
  )
}

function isGetWaitInstructionDTO(o: unknown): o is GetWaitInstructionDTO {
  return o != undefined && typeof o === 'object' && 'seconds' in o && typeof o.seconds === 'number'
}

function isGetStartTaskInstructionDTO(o: unknown): o is GetStartTaskInstructionDTO {
  return o != undefined && typeof o === 'object' && 'taskId' in o && typeof o.taskId === 'string'
}

function isGetDeviceActionInstructionDTO(o: unknown): o is GetDeviceActionInstructionDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'deviceActionId' in o &&
    typeof o.deviceActionId === 'string' &&
    'input' in o
  )
}

function isGetCreateConstantInstructionDTO(o: unknown): o is GetCreateConstantInstructionDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'type' in o &&
    isTypeDTO(o.type) &&
    'value' in o
  )
}

function isGetCreateDevicePropertyConstantInstructionDTO(
  o: unknown,
): o is GetCreateDevicePropertyConstantInstructionDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'type' in o &&
    isTypeDTO(o.type) &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'devicePropertyId' in o &&
    typeof o.devicePropertyId === 'string'
  )
}

function isGetIfInstructionDTO(o: unknown): o is GetIfInstructionDTO {
  return (
    !isGetIfElseInstructionDTO(o) &&
    o != undefined &&
    typeof o === 'object' &&
    'thenInstructions' in o &&
    Array.isArray(o.thenInstructions) &&
    o.thenInstructions.every((instruction) => isGetInstructionDTO(instruction)) &&
    'condition' in o &&
    isGetConditionDTO(o.condition)
  )
}

function isGetIfElseInstructionDTO(o: unknown): o is GetIfElseInstructionDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'thenInstructions' in o &&
    Array.isArray(o.thenInstructions) &&
    o.thenInstructions.every((instruction) => isGetInstructionDTO(instruction)) &&
    'elseInstructions' in o &&
    Array.isArray(o.elseInstructions) &&
    o.elseInstructions.every((instruction) => isGetInstructionDTO(instruction)) &&
    'condition' in o &&
    isGetConditionDTO(o.condition)
  )
}

export function isGetInstructionDTO(o: unknown): o is GetInstructionDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'type' in o &&
    isGetInstructionTypeDTO(o.type) &&
    'instruction' in o &&
    (isGetSendNotificationInstructionDTO(o.instruction) ||
      isGetWaitInstructionDTO(o.instruction) ||
      isGetStartTaskInstructionDTO(o.instruction) ||
      isGetDeviceActionInstructionDTO(o.instruction) ||
      isGetIfInstructionDTO(o.instruction) ||
      isGetIfElseInstructionDTO(o.instruction) ||
      isGetCreateConstantInstructionDTO(o.instruction) ||
      isGetCreateDevicePropertyConstantInstructionDTO(o.instruction))
  )
}

export const sendNotificationInstructionDeserializer = Deserializer<
  GetSendNotificationInstructionDTO,
  SendNotificationInstruction
>(isGetSendNotificationInstructionDTO, (dto) => {
  return {
    email: dto.email,
    message: dto.message,
  }
})

export const waitInstructionDeserializer = Deserializer<GetWaitInstructionDTO, WaitInstruction>(
  isGetWaitInstructionDTO,
  (dto) => {
    return {
      seconds: dto.seconds,
    }
  },
)

export const startTaskDeserializer = Deserializer<GetStartTaskInstructionDTO, StartTaskInstruction>(
  isGetStartTaskInstructionDTO,
  (dto) => {
    return {
      taskId: dto.taskId,
    }
  },
)

export const deviceActionInstructionDeserializer = Deserializer<
  GetDeviceActionInstructionDTO,
  DeviceActionInstruction
>(isGetDeviceActionInstructionDTO, (dto) => {
  return {
    deviceId: DeviceId(dto.deviceId),
    deviceActionId: DeviceActionId(dto.deviceActionId),
    input: dto.input,
  }
})

export const createConstantInstructionDeserializer = Deserializer<
  GetCreateConstantInstructionDTO,
  CreateConstantInstruction
>(isGetCreateConstantInstructionDTO, (dto) => {
  return {
    name: dto.name,
    type: typeDeserializer(dto.type),
    value: dto.value,
  }
})

export const createDevicePropertyConstantInstructionDeserializer = Deserializer<
  GetCreateDevicePropertyConstantInstructionDTO,
  CreateDevicePropertyConstantInstruction
>(isGetCreateDevicePropertyConstantInstructionDTO, (dto) => {
  return {
    name: dto.name,
    type: typeDeserializer(dto.type),
    deviceId: DeviceId(dto.deviceId),
    devicePropertyId: DevicePropertyId(dto.devicePropertyId),
  }
})

export const ifInstructionDeserializer = Deserializer<GetIfInstructionDTO, IfInstruction>(
  isGetIfInstructionDTO,
  (dto) => {
    return {
      condition: conditionDeserializer(dto.condition),
      thenInstructions: instructionsDeserializer(dto.thenInstructions),
    }
  },
)

export const ifElseInstructionDeserializer = Deserializer<
  GetIfElseInstructionDTO,
  IfElseInstruction
>(isGetIfElseInstructionDTO, (dto) => {
  return {
    condition: conditionDeserializer(dto.condition),
    thenInstructions: instructionsDeserializer(dto.thenInstructions),
    elseInstructions: instructionsDeserializer(dto.elseInstructions),
  }
})

function deserializeInstruction(
  instruction:
    | GetSendNotificationInstructionDTO
    | GetWaitInstructionDTO
    | GetStartTaskInstructionDTO
    | GetDeviceActionInstructionDTO
    | GetCreateConstantInstructionDTO
    | GetCreateDevicePropertyConstantInstructionDTO
    | GetIfInstructionDTO
    | GetIfElseInstructionDTO,
): RealInstruction {
  if (isGetSendNotificationInstructionDTO(instruction)) {
    return sendNotificationInstructionDeserializer(instruction)
  }
  if (isGetWaitInstructionDTO(instruction)) {
    return waitInstructionDeserializer(instruction)
  }
  if (isGetStartTaskInstructionDTO(instruction)) {
    return startTaskDeserializer(instruction)
  }
  if (isGetCreateConstantInstructionDTO(instruction)) {
    return createConstantInstructionDeserializer(instruction)
  }
  if (isGetCreateDevicePropertyConstantInstructionDTO(instruction)) {
    return createDevicePropertyConstantInstructionDeserializer(instruction)
  }
  if (isGetDeviceActionInstructionDTO(instruction)) {
    return deviceActionInstructionDeserializer(instruction)
  }
  if (isGetIfInstructionDTO(instruction)) {
    return ifInstructionDeserializer(instruction)
  }

  return ifElseInstructionDeserializer(instruction)
}

const instructionDeserializer = Deserializer<GetInstructionDTO, Instruction>(
  isGetInstructionDTO,
  (dto) => {
    return {
      type: instructionTypeDeserializer(dto.type),
      instruction: deserializeInstruction(dto.instruction),
    }
  },
)

export const instructionsDeserializer = arrayDeserializer(instructionDeserializer)
