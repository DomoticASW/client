import type { Device } from '@/model/devices-management/Device'
import { Color, type TypeConstraints } from '@/model/devices-management/Types'
import type {
  IfInstruction,
  IfElseInstruction,
  WaitInstruction,
  StartTaskInstruction,
  CreateConstantInstruction,
  SendNotificationInstruction,
  CreateDevicePropertyConstantInstruction,
  DeviceActionInstruction,
} from '@/model/scripts/Instruction'
import { ConditionOperatorType } from '@/model/scripts/Instruction'
import { Type } from '@/model/Type'

export function EmptyIfInstruction(): IfInstruction {
  return {
    thenInstructions: [],
    condition: {
      leftConstantName: '',
      rightConstantName: '',
      negate: false,
      conditionOperatorType: ConditionOperatorType.NumberEOperator,
    },
  }
}

export function EmptyIfElseInstruction(): IfElseInstruction {
  return {
    thenInstructions: [],
    elseInstructions: [],
    condition: {
      leftConstantName: '',
      rightConstantName: '',
      negate: false,
      conditionOperatorType: ConditionOperatorType.NumberEOperator,
    },
  }
}

export function EmptyWaitInstruction(): WaitInstruction {
  return {
    seconds: 1,
  }
}

export function EmptyStartTaskInstruction(): StartTaskInstruction {
  return {
    taskId: '',
  }
}

export function EmptyConstantInstruction(): CreateConstantInstruction {
  return {
    name: '',
    type: Type.StringType,
    value: '',
  }
}

export function EmptySendNotification(): SendNotificationInstruction {
  return {
    email: '',
    message: '',
  }
}

export function defaultDevicePropertyConstantInstruction(device: Device): CreateDevicePropertyConstantInstruction {
  return {
    deviceId: device.id,
    devicePropertyId: device.properties[0].id,
    name: '',
    type: device.properties[0].typeConstraints.type,
  }
}

export function defaultDeviceActionInstruction(device: Device): DeviceActionInstruction {
  return {
    deviceId: device.id,
    deviceActionId: device.actions[0].id,
    input: getDefaultInput(device.actions[0].inputTypeConstraints),
  }
}

export function getDefaultInput<T>(type: TypeConstraints<T>) {
  if (type.__brand === 'IntRange') {
    return type.min
  }

  if (type.__brand === 'DoubleRange') {
    return type.min
  }

  if (type.__brand === 'Enum') {
    return type.values.values().next().value
  }

  switch (type.type) {
    case Type.BooleanType:
      return false
    case Type.ColorType:
      return Color(0, 0, 0)
    case Type.VoidType:
      return undefined
    case Type.IntType:
    case Type.DoubleType:
      return 0
    case Type.StringType:
      return ''
  }
}
