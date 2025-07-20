export interface Device {
  id: string
  name: string
  address: DeviceAddress
}

export interface DeviceAddress {
  host: string
  port: number
}
