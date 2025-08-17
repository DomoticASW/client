import { DeviceGroupId, type DeviceGroup } from "@/model/devices-management/DeviceGroup"
import { Deserializer } from "../../../Deserializer"
import { deviceDeserializer, isDeviceDTO, type DeviceDTO } from "../devices/DeviceDTO"

export interface DeviceGroupDTO {
  id: string
  name: string
  devices: DeviceDTO[]
}

export function isDeviceGroupDTO(o: unknown): o is DeviceGroupDTO {
  return o != undefined && typeof o === "object" &&
    "id" in o && typeof o.id === "string" &&
    "name" in o && typeof o.name === "string" &&
    "devices" in o && Array.isArray(o.devices) && o.devices.every(isDeviceDTO)
}

export const deviceGroupDeserializer =
  Deserializer<DeviceGroupDTO, DeviceGroup>(
    isDeviceGroupDTO,
    (dto) => ({
      id: DeviceGroupId(dto.id),
      name: dto.name,
      devices: dto.devices.map(deviceDeserializer)
    }),
    (obj) => `Unable to parse ${obj} into a DeviceGroup since it was not a DeviceGroupDTO`
  )
