import type { Brand } from '@/utils'
import type { Instruction } from './Instruction'

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
  deviceId: string
  eventName: string
}
