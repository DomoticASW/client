import type { DeviceAddress } from '@/model/devices-management/Device'
import { Deserializer } from '../../../Deserializer'

export interface DeviceAddressDTO {
  host: string
  port: number
}

export function isDeviceAddressDTO(o: unknown): o is DeviceAddressDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'host' in o &&
    typeof o.host == 'string' &&
    'port' in o &&
    typeof o.port == 'number'
  )
}

export const deviceAddressDeserializer = Deserializer<DeviceAddressDTO, DeviceAddress>(
  isDeviceAddressDTO,
  (dto) => ({
    host: dto.host,
    port: dto.port,
  }),
  (obj) => `Unable to deserialize ${obj} into a DeviceAddress since it was not a DeviceAddressDTO`
)
