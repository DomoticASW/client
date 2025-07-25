import { Deserializer } from "../Deserializer"
import { deviceAddressDeserializer, isGetDeviceAddressDTO, type GetDeviceAddressDTO } from "./GetDeviceAddressDTO"
import type { DiscoveredDevice } from "@/model/devices-management/DiscoveredDevice"

export interface GetDiscoveredDeviceDTO {
  id: string
  name: string
  address: GetDeviceAddressDTO
}

export function isGetDiscoveredDeviceDTO(o: unknown): o is GetDiscoveredDeviceDTO {
  return o != undefined && typeof o == "object" &&
    "id" in o && typeof o.id == "string" &&
    "name" in o && typeof o.name == "string" &&
    "address" in o && isGetDeviceAddressDTO(o.address)
}

export const discoveredDeviceDeserializer = Deserializer<GetDiscoveredDeviceDTO, DiscoveredDevice>(isGetDiscoveredDeviceDTO, (dto) => {
  return {
    id: dto.id,
    name: dto.name,
    address: deviceAddressDeserializer(dto.address)
  }
})
