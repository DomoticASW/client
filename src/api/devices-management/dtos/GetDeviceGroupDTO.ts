import { DeviceGroupId, type DeviceGroup } from "@/model/devices-management/DeviceGroup"
import { Deserializer } from "../../Deserializer"
import { deviceDeserializer, isGetDeviceDTO, type GetDeviceDTO } from "./GetDeviceDTO"

export interface GetDeviceGroupDTO {
  id: string
  name: string
  devices: GetDeviceDTO[]
}

export function isGetDeviceGroupDTO(o: unknown): o is GetDeviceGroupDTO {
  return o != undefined && typeof o === "object" &&
    "id" in o && typeof o.id === "string" &&
    "name" in o && typeof o.name === "string" &&
    "devices" in o && Array.isArray(o.devices) && o.devices.every(isGetDeviceDTO)
}

export const deviceGroupDeserializer =
  Deserializer<GetDeviceGroupDTO, DeviceGroup>(
    isGetDeviceGroupDTO,
    (dto) => ({
      id: DeviceGroupId(dto.id),
      name: dto.name,
      devices: dto.devices.map(deviceDeserializer)
    }),
    (obj) => `Unable to parse ${obj} into a DeviceGroup since it was not a GetDeviceGroupDTO`
  )
