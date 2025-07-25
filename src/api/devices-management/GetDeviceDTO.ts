import type { Device } from "@/model/devices-management/Device"
import { Deserializer } from "../Deserializer"
import { deviceAddressDeserializer, isGetDeviceAddressDTO, type GetDeviceAddressDTO } from "./GetDeviceAddressDTO"

export interface GetDeviceDTO {
  id: string
  name: string
  address: GetDeviceAddressDTO
}

export function isGetDeviceDTO(o: unknown): o is GetDeviceDTO {
  return o != undefined && typeof o == "object" &&
    "id" in o && typeof o.id == "string" &&
    "name" in o && typeof o.name == "string" &&
    "address" in o && isGetDeviceAddressDTO(o.address)
}


export const deviceDeserializer = Deserializer<GetDeviceDTO, Device>(isGetDeviceDTO, (dto) => {
  return {
    id: dto.id,
    name: dto.name,
    address: deviceAddressDeserializer(dto.address)
  }
})
