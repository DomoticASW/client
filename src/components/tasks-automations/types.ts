export enum Operator {
  GREATER,
  GREATER_EQ,
}

export interface TypeConstraints {
  type: Type
}

export interface Enum extends TypeConstraints {
  values: Set<string>
}

export enum Type {
  IntType = 'IntType',
  DoubleType = 'DoubleType',
  BooleanType = 'BooleanType',
  ColorType = 'ColorType',
  StringType = 'StringType',
  VoidType = 'VoidType',
}

export type Instruction =
  | ConstantInstruction
  | IfInstruction
  | DeviceActionInstruction
  | SendNotificationInstruction

export interface ConstantInstruction {
  name: string,
  value: unknown
}

export interface CreateDevicePropertyConstantInstruction extends ConstantInstruction {
  deviceId: string
  devicePropertyId: string
}

export interface IfInstruction {
  left: string
  right: string
  operator: Operator
  then: Instruction[]
}

export interface IfElseInstruction extends IfInstruction {
  else: Instruction[]
}

export interface DeviceActionInstruction {
  deviceId: string
  deviceActionId: string
  typeConstraints: TypeConstraints
  input: unknown
}

export interface SendNotificationInstruction {
  email: string
  message: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSendNotificationInstruction(o: any): o is SendNotificationInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'email' in o &&
    typeof o.email === 'string' &&
    'message' in o &&
    typeof o.message === 'string'
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDeviceActionInstruction(o: any): o is DeviceActionInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'deviceActionId' in o &&
    typeof o.deviceActionId === 'string' &&
    'input' in o
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConstantInstruction(o: any): o is ConstantInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'value' in o &&
    !isCreateDevicePropertyConstantInstruction(o)
  ) //Just to not have property constant ad constants, not needed with final code
}

export function isCreateDevicePropertyConstantInstruction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: any,
): o is CreateDevicePropertyConstantInstruction {
  return (
    o &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    'deviceId' in o &&
    typeof o.deviceId === 'string' &&
    'devicePropertyId' in o &&
    typeof o.devicePropertyId === 'string' &&
    'value' in o
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIfInstruction(o: any): o is IfInstruction {
  return o && typeof o === 'object' && 'then' in o && Array.isArray(o.then)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIfElseInstruction(o: any): o is IfElseInstruction {
  return isIfInstruction(o) && 'else' in o && Array.isArray(o.else)
}
