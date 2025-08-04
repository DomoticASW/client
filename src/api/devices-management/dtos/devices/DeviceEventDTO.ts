import type { DeviceEvent } from "@/model/devices-management/Device";
import { Deserializer } from "../../../Deserializer";

export interface DeviceEventDTO {
  readonly name: string;
}

export function isDeviceEventDTO(o: unknown): o is DeviceEventDTO {
  return o != undefined && typeof o == "object" &&
    "name" in o && typeof o.name == "string"
}

export const deviceEventDeserializer =
  Deserializer<DeviceEventDTO, DeviceEvent>(
    isDeviceEventDTO,
    (dto) => ({ name: dto.name }),
    (obj) => `Unable to deserialize ${obj} into a DeviceEvent since it was not a DeviceEventDTO`
  )
