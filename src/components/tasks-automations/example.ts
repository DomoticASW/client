import { ref } from 'vue'
import {
  type Instruction,
  type CreateDevicePropertyConstantInstruction,
  type IfInstruction,
  type IfElseInstruction,
  type DeviceActionInstruction,
  type SendNotificationInstruction,
  ConditionOperatorType,
  InstructionType,
  type CreateConstantInstruction,
} from '@/model/scripts/Instruction'

// To remove when getting instructions from server, will only be necessary the isXInstruction to deserialize the instructions, but has to do better checks
export const instructions = ref([
  CreateDevicePropertyConstantInstruction('Roomba', 'Battery', 'Battery'),
  CreateConstantInstruction('Critical battery level', 25),
  IfElseInstruction(
    'Battery',
    'Critical battery level',
    ConditionOperatorType.NumberGOperator,
    [
      DeviceActionInstruction('Roomba', 'Start', undefined),
      CreateConstantInstruction('High battery level', 75),
      IfInstruction('Battery', 'High battery level', ConditionOperatorType.NumberGEOperator, [
        DeviceActionInstruction('Roomba', 'Set mode', 'Performance'),
      ]),
    ],
    [
      DeviceActionInstruction('Roomba', 'Stop', undefined),
      SendNotificationInstruction('Emma', 'The Roomba stopped'),
    ],
  ),
])

function CreateDevicePropertyConstantInstruction(
  deviceId: string,
  devicePropertyId: string,
  name: string,
): Instruction {
  return {
    type: InstructionType.CreateDevicePropertyConstantInstruction,
    instruction: {
      deviceId: deviceId,
      devicePropertyId: devicePropertyId,
      name: name,
    } as CreateDevicePropertyConstantInstruction,
  }
}

function CreateConstantInstruction(name: string, value: unknown): Instruction {
  return {
    type: InstructionType.CreateConstantInstruction,
    instruction: { name: name, value: value } as CreateConstantInstruction,
  }
}

function IfInstruction(
  left: string,
  right: string,
  operator: ConditionOperatorType,
  then: Instruction[],
): Instruction {
  return {
    type: InstructionType.IfInstruction,
    instruction: {
      condition: {
        leftConstantName: left,
        rightConstantName: right,
        negate: false,
        conditionOperatorType: operator,
      },
      thenInstructions: then,
    } as IfInstruction,
  }
}

function IfElseInstruction(
  left: string,
  right: string,
  operator: ConditionOperatorType,
  then: Instruction[],
  elseInstructions: Instruction[],
): Instruction {
  return {
    type: InstructionType.IfElseInstruction,
    instruction: {
      condition: {
        leftConstantName: left,
        rightConstantName: right,
        negate: false,
        conditionOperatorType: operator,
      },
      thenInstructions: then,
      elseInstructions: elseInstructions,
    } as IfElseInstruction,
  }
}

function DeviceActionInstruction(
  deviceId: string,
  deviceActionId: string,
  input: unknown,
): Instruction {
  return {
    type: InstructionType.DeviceActionInstruction,
    instruction: {
      deviceId: deviceId,
      deviceActionId: deviceActionId,
      input: input,
    } as DeviceActionInstruction,
  }
}

function SendNotificationInstruction(email: string, message: string): Instruction {
  return {
    type: InstructionType.SendNotificationInstruction,
    instruction: {
      email: email,
      message: message,
    } as SendNotificationInstruction,
  }
}

export const trigger = {
  start: new Date(),
  periodSeconds: 7202,
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
