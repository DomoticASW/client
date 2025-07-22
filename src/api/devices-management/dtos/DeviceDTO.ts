import { DeviceId, type Device } from "@/model/devices-management/Device"
import { Deserializer } from "../../Deserializer"
import { deviceAddressDeserializer, isDeviceAddressDTO, type DeviceAddressDTO } from "./DeviceAddressDTO"

export interface DeviceDTO {
  id: string
  name: string
  address: DeviceAddressDTO
}

export function isDeviceDTO(o: unknown): o is DeviceDTO {
  return o != undefined && typeof o == "object" &&
    "id" in o && typeof o.id == "string" &&
    "name" in o && typeof o.name == "string" &&
    "address" in o && isDeviceAddressDTO(o.address)
}


export const deviceDeserializer =
  Deserializer<DeviceDTO, Device>(
    isDeviceDTO,
    (dto) => ({
      id: DeviceId(dto.id),
      name: dto.name,
      address: deviceAddressDeserializer(dto.address)
    }),
    (obj) => `Unable to deserialize ${obj} into a Device since it was not a DeviceDTO`
  )
