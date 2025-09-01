import { DeviceActionId, type DeviceAction } from '@/model/devices-management/Device'
import { Deserializer } from '../../../Deserializer'
import {
  isTypeConstraintsDTO,
  typeConstraintsDeserializer,
  type TypeConstraintsDTO,
} from './TypeConstraintsDTO'

export interface DeviceActionDTO {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly inputTypeConstraints: TypeConstraintsDTO
}

export function isDeviceActionDTO(o: unknown): o is DeviceActionDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'id' in o &&
    typeof o.id == 'string' &&
    'name' in o &&
    typeof o.name == 'string' &&
    ('description' in o ? typeof o.description == 'string' : true) &&
    'inputTypeConstraints' in o &&
    isTypeConstraintsDTO(o.inputTypeConstraints)
  )
}

export const deviceActionDeserializer = Deserializer<DeviceActionDTO, DeviceAction<unknown>>(
  isDeviceActionDTO,
  (dto) => ({
    id: DeviceActionId(dto.id),
    name: dto.name,
    description: dto.description,
    inputTypeConstraints: typeConstraintsDeserializer(dto.inputTypeConstraints),
  }),
  (obj) => `Unable to deserialize ${obj} into a DeviceAction since it was not a DeviceActionDTO`
)
