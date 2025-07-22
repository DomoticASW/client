import type { DeviceAddress } from "@/model/devices-management/Device";
import { Deserializer } from "../../Deserializer";

export interface GetDeviceAddressDTO {
  host: string;
  port: number;
}

export function isGetDeviceAddressDTO(o: unknown): o is GetDeviceAddressDTO {
  return o != undefined && typeof o == "object" &&
    "host" in o && typeof o.host == "string" &&
    "port" in o && typeof o.port == "number"
}

export const deviceAddressDeserializer =
  Deserializer<GetDeviceAddressDTO, DeviceAddress>(
    isGetDeviceAddressDTO,
    (dto) => ({
      host: dto.host,
      port: dto.port
    }),
    (obj) => `Unable to deserialize ${obj} into a DeviceAddress since it was not a GetDeviceAddressDTO`
  )
