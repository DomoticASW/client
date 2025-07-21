import type { Device } from "@/model/devices-management/Device"
import { Deserializer } from "../Deserializer"

export interface GetDeviceDTO {
  id: string
  name: string
}

function isGetDeviceDTO(obj: unknown): obj is GetDeviceDTO {
  return true
}

export const toDeviceDeserializer = Deserializer<GetDeviceDTO, Device>(isGetDeviceDTO, (dto) => ({ id: dto.id, name: dto.name }))
