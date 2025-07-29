import type { Brand } from "@/utils"

export type DeviceId = Brand<string, "DeviceId">
export function DeviceId(id: string): DeviceId { return id as DeviceId }

export interface Device {
  id: DeviceId
  name: string
  address: DeviceAddress
}

export interface DeviceAddress {
  host: string
  port: number
}
