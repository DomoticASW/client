import type { DeviceActionId, DeviceId, DevicePropertyId } from '../devices-management/Device'
import type { Type } from '../Type'

export enum InstructionType {
  SendNotificationInstruction = 'SendNotificationInstruction',
  WaitInstruction = 'WaitInstruction',
  StartTaskInstruction = 'StartTaskInstruction',
  DeviceActionInstruction = 'DeviceActionInstruction',
  CreateConstantInstruction = 'CreateConstantInstruction',
  CreateDevicePropertyConstantInstruction = 'CreateDevicePropertyConstantInstruction',
  IfInstruction = 'IfInstruction',
  IfElseInstruction = 'IfElseInstruction',
}

export interface Condition {
  leftConstantName: string
  rightConstantName: string
  negate: boolean
  conditionOperatorType: ConditionOperatorType
}

export enum ConditionOperatorType {
  NumberEOperator = 'NumberEOperator',
  NumberGEOperator = 'NumberGEOperator',
  NumberLEOperator = 'NumberLEOperator',
  NumberLOperator = 'NumberLOperator',
  NumberGOperator = 'NumberGOperator',
  StringEOperator = 'StringEOperator',
  ColorEOperator = 'ColorEOperator',
  BooleanEOperator = 'BooleanEOperator',
}

export interface Instruction {
  type: InstructionType
  instruction: RealInstruction
}

export type RealInstruction =
  | SendNotificationInstruction
  | WaitInstruction
  | StartTaskInstruction
  | DeviceActionInstruction
  | CreateConstantInstruction
  | CreateDevicePropertyConstantInstruction
  | IfInstruction
  | IfElseInstruction

export interface SendNotificationInstruction {
  email: string
  message: string
}

export interface WaitInstruction {
  seconds: number
}

export interface StartTaskInstruction {
  taskId: string
}

export interface DeviceActionInstruction {
  deviceId: DeviceId
  deviceActionId: DeviceActionId
  input: unknown
}

export interface ConstantInstruction {
  name: string
  type: Type
}

export interface CreateConstantInstruction extends ConstantInstruction {
  value: unknown
}

export interface CreateDevicePropertyConstantInstruction extends ConstantInstruction {
  deviceId: DeviceId
  devicePropertyId: DevicePropertyId
}

export interface IfInstruction {
  thenInstructions: Instruction[]
  condition: Condition
}

export interface IfElseInstruction extends IfInstruction {
  elseInstructions: Instruction[]
}
