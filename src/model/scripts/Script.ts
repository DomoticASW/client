import type { Instruction } from "./Instruction"

export interface Task {
  id: string
  name: string
  instructions: Instruction[]
}

export interface Automation extends Task{
  enabled: boolean
  trigger: Trigger
}

type Trigger = PeriodTrigger | DeviceEventTrigger

export interface PeriodTrigger {
  start: Date
  periodSeconds: number
}

export interface DeviceEventTrigger {
  deviceId: string,
  eventName: string
}
