import type { Brand } from "@/utils"
import type { Device } from "./Device"

export type DeviceGroupId = Brand<string, "DeviceGroupId">
export function DeviceGroupId(id: string): DeviceGroupId { return id as DeviceGroupId }

export interface DeviceGroup {
  id: DeviceGroupId
  name: string
  devices: Device[]
}
