import { DeviceStatus } from "@/model/devices-management/Device";
import { Deserializer } from "../../../Deserializer";

export type DeviceStatusDTO = string

export function isDeviceStatusDTO(o: unknown): o is DeviceStatusDTO {
  return o != undefined && typeof o == "string" &&
    Object.values(DeviceStatus).includes(o as DeviceStatus)
}

export const deviceStatusDeserializer =
  Deserializer<DeviceStatusDTO, DeviceStatus>(
    isDeviceStatusDTO,
    (dto) => (dto as DeviceStatus),
    (obj) => `Unable to deserialize ${obj} into a DeviceStatus since it was not a DeviceStatusDTO`
  )
