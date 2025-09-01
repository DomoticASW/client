import type { Brand } from '@/utils'
import type { TypeConstraints } from './Types'

export type DeviceId = Brand<string, 'DeviceId'>
export function DeviceId(id: string): DeviceId {
  return id as DeviceId
}
export type DevicePropertyId = Brand<string, 'DevicePropertyId'>
export function DevicePropertyId(id: string): DevicePropertyId {
  return id as DevicePropertyId
}
export type DeviceActionId = Brand<string, 'DeviceActionId'>
export function DeviceActionId(id: string): DeviceActionId {
  return id as DeviceActionId
}

export interface Device {
  id: DeviceId
  name: string
  address: DeviceAddress
  status: DeviceStatus
  properties: DeviceProperty<unknown>[]
  actions: DeviceAction<unknown>[]
  events: DeviceEvent[]
}

export interface DeviceAddress {
  host: string
  port: number
}

export enum DeviceStatus {
  Online = 'Online',
  Offline = 'Offline',
}

export interface DeviceProperty<T> {
  readonly id: DevicePropertyId
  readonly name: string
  value: T

  readonly setter?: DeviceAction<T>
  readonly typeConstraints: TypeConstraints<T>
}

export interface DeviceAction<T> {
  readonly id: DeviceActionId
  readonly name: string
  readonly description?: string

  readonly inputTypeConstraints: TypeConstraints<T>
}

export interface DeviceEvent {
  readonly name: string
}
