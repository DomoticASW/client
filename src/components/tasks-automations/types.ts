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

