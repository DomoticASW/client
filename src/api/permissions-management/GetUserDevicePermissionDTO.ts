import type { UserDevicePermission } from '@/model/permissions-management/UserDevicePermission'
import { Deserializer } from '../Deserializer'

export interface GetUseDevicePermissionDTO {
  email: string
  deviceId: string
}

export function isGetUserDevicePermissionDTO(o: unknown): o is GetUseDevicePermissionDTO {
  return (
    o != undefined &&
    typeof o == 'object' &&
    'email' in o &&
    typeof o.email == 'string' &&
    'deviceId' in o &&
    typeof o.deviceId == 'string'
  )
}

export const deviceDeserializer = Deserializer<GetUseDevicePermissionDTO, UserDevicePermission>(
  isGetUserDevicePermissionDTO,
  (dto) => {
    return {
      email: dto.email,
      deviceId: dto.deviceId,
    }
  },
)
