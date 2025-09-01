import { DeviceId, type Device } from '@/model/devices-management/Device'
import { arrayDeserializer, Deserializer } from '../../../Deserializer'
import {
  deviceAddressDeserializer,
  isDeviceAddressDTO,
  type DeviceAddressDTO,
} from './DeviceAddressDTO'
import {
  deviceStatusDeserializer,
  isDeviceStatusDTO,
  type DeviceStatusDTO,
} from './DeviceStatusDTO'
import { deviceEventDeserializer, isDeviceEventDTO, type DeviceEventDTO } from './DeviceEventDTO'
import {
  deviceActionDeserializer,
  isDeviceActionDTO,
  type DeviceActionDTO,
} from './DeviceActionDTO'
import {
  devicePropertyDeserializer,
  isDevicePropertyDTO,
  type DevicePropertyDTO,
} from './DevicePropertyDTO'

export interface DeviceDTO {
  readonly id: string
  readonly name: string
  readonly address: DeviceAddressDTO
  readonly status: DeviceStatusDTO
  readonly properties: DevicePropertyDTO[]
  readonly actions: DeviceActionDTO[]
  readonly events: DeviceEventDTO[]
}

export function isDeviceDTO(o: unknown): o is DeviceDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'id' in o &&
    typeof o.id == 'string' &&
    'name' in o &&
    typeof o.name == 'string' &&
    'address' in o &&
    isDeviceAddressDTO(o.address) &&
    'status' in o &&
    isDeviceStatusDTO(o.status) &&
    'properties' in o &&
    Array.isArray(o.properties) &&
    o.properties.every((p) => isDevicePropertyDTO(p)) &&
    'actions' in o &&
    Array.isArray(o.actions) &&
    o.actions.every((a) => isDeviceActionDTO(a)) &&
    'events' in o &&
    Array.isArray(o.events) &&
    o.events.every((e) => isDeviceEventDTO(e))
  )
}

export const deviceDeserializer = Deserializer<DeviceDTO, Device>(
  isDeviceDTO,
  (dto) => ({
    id: DeviceId(dto.id),
    name: dto.name,
    address: deviceAddressDeserializer(dto.address),
    status: deviceStatusDeserializer(dto.status),
    properties: arrayDeserializer(devicePropertyDeserializer)(dto.properties),
    actions: arrayDeserializer(deviceActionDeserializer)(dto.actions),
    events: arrayDeserializer(deviceEventDeserializer)(dto.events),
  }),
  (obj) => `Unable to deserialize ${obj} into a Device since it was not a DeviceDTO`
)
