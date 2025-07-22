import type { Device } from "./Device"

export interface DeviceGroup {
  id: string
  name: string
  devices: Device[]
}
