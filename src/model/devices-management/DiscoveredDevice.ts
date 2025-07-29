import type { Brand } from "@/utils"
import type { DeviceAddress } from "./Device"

export type DiscoveredDeviceId = Brand<string, "DiscoveredDeviceId">
export function DiscoveredDeviceId(id: string): DiscoveredDeviceId { return id as DiscoveredDeviceId }

export interface DiscoveredDevice {
  id: DiscoveredDeviceId
  name: string
  address: DeviceAddress
}
