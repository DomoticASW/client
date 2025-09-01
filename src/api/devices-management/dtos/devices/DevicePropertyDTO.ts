import { DevicePropertyId, type DeviceProperty } from '@/model/devices-management/Device'
import { Deserializer } from '../../../Deserializer'
import {
  isTypeConstraintsDTO,
  typeConstraintsDeserializer,
  type TypeConstraintsDTO,
} from './TypeConstraintsDTO'
import {
  deviceActionDeserializer,
  isDeviceActionDTO,
  type DeviceActionDTO,
} from './DeviceActionDTO'
import { colorDeserializer, isColorDTO } from './ColorDTO'

export interface DevicePropertyDTO {
  readonly id: string
  readonly name: string
  readonly value: unknown
  readonly typeConstraints: TypeConstraintsDTO
  readonly setter?: DeviceActionDTO
}

export function isDevicePropertyDTO(o: unknown): o is DevicePropertyDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'id' in o &&
    typeof o.id == 'string' &&
    'name' in o &&
    typeof o.name == 'string' &&
    'value' in o &&
    ('setter' in o && o.setter != undefined ? isDeviceActionDTO(o.setter) : true) &&
    'typeConstraints' in o &&
    isTypeConstraintsDTO(o.typeConstraints)
  )
}

export const devicePropertyDeserializer = Deserializer<DevicePropertyDTO, DeviceProperty<unknown>>(
  isDevicePropertyDTO,
  (dto) => {
    let value: unknown
    if (isColorDTO(dto.value)) {
      value = colorDeserializer(dto.value)
    } else {
      value = dto.value
    }
    return {
      id: DevicePropertyId(dto.id),
      name: dto.name,
      value: value,
      setter: dto.setter ? deviceActionDeserializer(dto.setter) : undefined,
      typeConstraints: typeConstraintsDeserializer(dto.typeConstraints),
    }
  },
  (obj) => `Unable to deserialize ${obj} into a DeviceProperty since it was not a DevicePropertyDTO`
)
