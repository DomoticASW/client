import { Deserializer } from '../../../Deserializer'
import {
  deviceAddressDeserializer,
  isDeviceAddressDTO,
  type DeviceAddressDTO,
} from './DeviceAddressDTO'
import {
  DiscoveredDeviceId,
  type DiscoveredDevice,
} from '@/model/devices-management/DiscoveredDevice'

export interface DiscoveredDeviceDTO {
  id: string
  name: string
  address: DeviceAddressDTO
}

export function isDiscoveredDeviceDTO(o: unknown): o is DiscoveredDeviceDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'id' in o &&
    typeof o.id == 'string' &&
    'name' in o &&
    typeof o.name == 'string' &&
    'address' in o &&
    isDeviceAddressDTO(o.address)
  )
}

export const discoveredDeviceDeserializer = Deserializer<DiscoveredDeviceDTO, DiscoveredDevice>(
  isDiscoveredDeviceDTO,
  (dto) => ({
    id: DiscoveredDeviceId(dto.id),
    name: dto.name,
    address: deviceAddressDeserializer(dto.address),
  }),
  (obj) =>
    `Unable to deserialize ${obj} into a DiscoveredDevice since it was not a DiscoveredDeviceDTO`
)
