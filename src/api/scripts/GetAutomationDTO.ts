import type { Automation, DeviceEventTrigger, PeriodTrigger } from '@/model/scripts/Script'
import { arrayDeserializer, Deserializer } from '../Deserializer'
import type { GetTaskDTO } from './GetTaskDTO'
import { instructionsDeserializer, isGetInstructionDTO } from './GetInstructionDTO'

interface GetPeriodTriggerDTO {
  start: string
  periodSeconds: number
}

interface GetDeviceEventTriggerDTO {
  deviceId: string
  eventName: string
}

type GetTriggerDTO = GetPeriodTriggerDTO | GetDeviceEventTriggerDTO

export interface GetAutomationDTO extends GetTaskDTO {
  enabled: boolean
  trigger: GetTriggerDTO
}

function isGetPeriodTriggerDTO(o: unknown): o is GetPeriodTriggerDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'start' in o &&
    typeof o.start === 'string' &&
    'periodSeconds' in o &&
    typeof o.periodSeconds === 'number'
  )
}

function isGetDeviceEventTriggerDTO(o: unknown): o is GetDeviceEventTriggerDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'eventName' in o &&
    typeof o.eventName === 'string'
  )
}

const periodTriggerDeserializer = Deserializer<GetPeriodTriggerDTO, PeriodTrigger>(
  isGetPeriodTriggerDTO,
  (dto) => {
    return {
      start: new Date(dto.start),
      periodSeconds: dto.periodSeconds,
    }
  },
)

const deviceEventTriggerDeserializer = Deserializer<GetDeviceEventTriggerDTO, DeviceEventTrigger>(
  isGetDeviceEventTriggerDTO,
  (dto) => {
    return {
      deviceId: dto.deviceId,
      eventName: dto.eventName,
    }
  },
)

function isGetAutomationDTO(o: unknown): o is GetAutomationDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'id' in o &&
    typeof o.id === 'string' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'enabled' in o &&
    typeof o.enabled === 'boolean' &&
    'trigger' in o &&
    (isGetDeviceEventTriggerDTO(o.trigger) || isGetPeriodTriggerDTO(o.trigger)) &&
    'instructions' in o &&
    Array.isArray(o.instructions) &&
    o.instructions.every((instruction) => isGetInstructionDTO(instruction))
  )
}

export const automationDeserializer = Deserializer<GetAutomationDTO, Automation>(
  isGetAutomationDTO,
  (dto) => {
    return {
      id: dto.id,
      name: dto.name,
      enabled: dto.enabled,
      trigger: isGetDeviceEventTriggerDTO(dto.trigger)
        ? deviceEventTriggerDeserializer(dto.trigger)
        : periodTriggerDeserializer(dto.trigger),
      instructions: instructionsDeserializer(dto.instructions),
    }
  },
)

export const automationsDeserializer = arrayDeserializer(automationDeserializer)
