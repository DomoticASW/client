import type { Brand } from '@/utils'
import type { Instruction } from './Instruction'
import type { DeviceId } from '../devices-management/Device'

export type ScriptId = TaskId | AutomationId

export type TaskId = Brand<string, 'TaskId'>
export type AutomationId = Brand<string, 'AutomationId'>
export function TaskId(id: string): TaskId {
  return id as TaskId
}
export function AutomationId(id: string): AutomationId {
  return id as AutomationId
}

export interface Script<ScriptId> {
  id: ScriptId
  name: string
  instructions: Instruction[]
}

export type Task = Script<TaskId>

export interface Automation extends Script<AutomationId> {
  enabled: boolean
  trigger: Trigger
}

export type Trigger = PeriodTrigger | DeviceEventTrigger

export interface PeriodTrigger {
  start: Date
  periodSeconds: number
}

export interface DeviceEventTrigger {
  deviceId: DeviceId
  eventName: string
}

export function isPeriodTrigger(o: unknown): o is PeriodTrigger {
  return o != undefined
    && typeof o === 'object'
    && 'start' in o
    && 'periodSeconds' in o
    && typeof o.periodSeconds === 'number'
}

export function isDeviceEventTrigger(o: unknown): o is DeviceEventTrigger {
  return o != undefined
    && typeof o === 'object'
    && 'deviceId' in o
    && typeof o.deviceId === 'string'
    && 'eventName' in o
    && typeof o.eventName === 'string'
}
