import type { Brand } from '@/utils'
import type { Instruction } from './Instruction'

export type ScriptId = TaskId | AutomationId

export type TaskId = Brand<string, 'TaskId'>
export type AutomationId = Brand<string, 'AutomationId'>
export function TaskId(id: string): TaskId { return id as TaskId }
export function AutomationId(id: string): AutomationId { return id as AutomationId }

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

export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const aa = String(date.getFullYear()).slice(-2) // Get last two digits of year
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${dd}/${mm}/${aa} ${hh}:${min}`
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} second${secs !== 1 ? 's' : ''}`)
  }

  return parts.join(' ')
}
