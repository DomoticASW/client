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

export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const aa = String(date.getFullYear()).slice(-2) // Get last two digits of year
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${dd}/${mm}/${aa} ${hh}:${min}`
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  }
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

export function convertToSeconds(
  value: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
): number {
  switch (unit) {
    case 'seconds':
      return value
    case 'minutes':
      return value * 60
    case 'hours':
      return value * 3600
    case 'days':
      return value * 86400
    default:
      throw new Error(`Unsupported time unit: ${unit}`)
  }
}

export function decomposeToLargestUnit(seconds: number): {
  value: number
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
} {
  if (seconds % 86400 === 0) {
    return { value: seconds / 86400, unit: 'days' }
  } else if (seconds % 3600 === 0) {
    return { value: seconds / 3600, unit: 'hours' }
  } else if (seconds % 60 === 0) {
    return { value: seconds / 60, unit: 'minutes' }
  } else {
    return { value: seconds, unit: 'seconds' }
  }
}

