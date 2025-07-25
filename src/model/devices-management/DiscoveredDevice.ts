import type { DeviceAddress } from "./Device"

export interface DiscoveredDevice {
  id: string
  name: string
  address: DeviceAddress
}
