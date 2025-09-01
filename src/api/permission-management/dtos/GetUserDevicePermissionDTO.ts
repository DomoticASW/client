import type { UserDevicePermission } from '@/model/permission-management/UserDevicePermission'
import { Deserializer } from '../../Deserializer'

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

export const userDevicePermissionDeserializer = Deserializer<
  GetUseDevicePermissionDTO,
  UserDevicePermission
>(
  isGetUserDevicePermissionDTO,
  (dto) => ({
    email: dto.email,
    deviceId: dto.deviceId,
  }),
  (obj) =>
    `Unable to deserialize ${obj} into a UserDevicePermission since it was not a GetUseDevicePermissionDTO`
)
