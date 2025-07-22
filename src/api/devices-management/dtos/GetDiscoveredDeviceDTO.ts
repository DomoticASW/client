import { Deserializer } from "../../Deserializer"
import { deviceAddressDeserializer, isGetDeviceAddressDTO, type GetDeviceAddressDTO } from "./GetDeviceAddressDTO"
import { DiscoveredDeviceId, type DiscoveredDevice } from "@/model/devices-management/DiscoveredDevice"

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

export const discoveredDeviceDeserializer =
  Deserializer<GetDiscoveredDeviceDTO, DiscoveredDevice>(
    isGetDiscoveredDeviceDTO,
    (dto) => ({
      id: DiscoveredDeviceId(dto.id),
      name: dto.name,
      address: deviceAddressDeserializer(dto.address)
    }),
    (obj) => `Unable to deserialize ${obj} into a DiscoveredDevice since it was not a GetDiscoveredDeviceDTO`
  )
