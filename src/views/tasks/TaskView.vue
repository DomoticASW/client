<script setup lang="ts">
import { ref } from 'vue'

enum Operator {
  GREATER,
  GREATER_EQ,
}

interface TypeConstraints {
  type: Type
}

interface Enum extends TypeConstraints {
  values: Set<string>
}

enum Type {
  IntType = 'IntType',
  DoubleType = 'DoubleType',
  BooleanType = 'BooleanType',
  ColorType = 'ColorType',
  StringType = 'StringType',
  VoidType = 'VoidType',
}

function EmptyConstraint(type: Type): TypeConstraints {
  return {
    type: type,
  }
}

function EnumConstraint(values: Set<string>): Enum {
  return {
    type: Type.StringType,
    values: values,
  }
}

// To remove when getting instructions from server, will only be necessary the isXInstruction to deserialize the instructions
const instructions = ref([
  CreateDevicePropertyConstantInstruction('Roomba', 'Battery', 'Battery', 70),
  CreateConstantInstruction('Critical battery level', 25),
  IfElseInstruction(
    'Battery',
    'Critical battery level',
    Operator.GREATER,
    [
      DeviceActionInstruction('Roomba', 'Start', EmptyConstraint(Type.VoidType), undefined),
      CreateConstantInstruction('High battery level', 75),
      IfInstruction('Battery', 'High battery level', Operator.GREATER_EQ, [
        DeviceActionInstruction(
          'Roomba',
          'Set mode',
          EnumConstraint(new Set(['Performance', 'Silence', 'Deep cleaning'])),
          'Performance',
        ),
      ]),
    ],
    [
      DeviceActionInstruction('Roomba', 'Stop', EmptyConstraint(Type.VoidType), undefined),
      SendNotificationInstruction('Emma', 'Message to be sent'),
    ],
  ),
])

type Instruction =
  | ConstantInstruction
  | IfInstruction
  | DeviceActionInstruction
  | SendNotificationInstruction

interface ConstantInstruction {
  name: string,
  value: unknown
}

interface CreateDevicePropertyConstantInstruction extends ConstantInstruction {
  deviceId: string
  devicePropertyId: string
}

interface IfInstruction {
  left: string
  right: string
  operator: Operator
  then: Instruction[]
}

interface IfElseInstruction extends IfInstruction {
  else: Instruction[]
}

interface DeviceActionInstruction {
  deviceId: string
  deviceActionId: string
  typeConstraints: TypeConstraints
  input: unknown
}

interface SendNotificationInstruction {
  email: string
  message: string
}

function CreateDevicePropertyConstantInstruction(
  deviceId: string,
  devicePropertyId: string,
  name: string,
  value: unknown
): CreateDevicePropertyConstantInstruction {
  return {
    deviceId: deviceId,
    devicePropertyId: devicePropertyId,
    name: name,
    value: value
  }
}

function CreateConstantInstruction(name: string, value: unknown): ConstantInstruction {
  return { name: name, value: value }
}

function IfInstruction(
  left: string,
  right: string,
  operator: Operator,
  then: Instruction[],
): IfInstruction {
  return {
    left: left,
    right: right,
    operator: operator,
    then: then,
  }
}

function IfElseInstruction(
  left: string,
  right: string,
  operator: Operator,
  then: Instruction[],
  elseInstructions: Instruction[],
): IfElseInstruction {
  return {
    left: left,
    right: right,
    operator: operator,
    then: then,
    else: elseInstructions,
  }
}

function DeviceActionInstruction(
  deviceId: string,
  deviceActionId: string,
  typeConstraints: TypeConstraints,
  input: unknown,
): DeviceActionInstruction {
  return {
    deviceId: deviceId,
    deviceActionId: deviceActionId,
    typeConstraints: typeConstraints,
    input: input,
  }
}

function SendNotificationInstruction(email: string, message: string): SendNotificationInstruction {
  return {
    email: email,
    message: message,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSendNotificationInstruction(o: any): o is SendNotificationInstruction {
  return o &&
    typeof o === 'object' &&
    'email' in o && typeof o.email === 'string' &&
    'message' in o && typeof o.message === 'string'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDeviceActionInstruction(o: any): o is DeviceActionInstruction {
  return o &&
    typeof o === 'object' &&
    'deviceId' in o && typeof o.deviceId === 'string' &&
    'deviceActionId' in o && typeof o.deviceActionId === 'string' &&
    'input' in o
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isConstantInstruction(o: any): o is ConstantInstruction {
  return o &&
    typeof o === 'object' &&
    'name' in o && typeof o.name === 'string' &&
    'value' in o
    && !isCreateDevicePropertyConstantInstruction(o) //Just to not have property constant ad constants, not needed with final code
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isCreateDevicePropertyConstantInstruction(o: any): o is CreateDevicePropertyConstantInstruction {
  return o &&
    typeof o === 'object' &&
    'name' in o && typeof o.name === 'string' &&
    'deviceId' in o && typeof o.deviceId === 'string' &&
    'devicePropertyId' in o && typeof o.devicePropertyId === 'string'
    && 'value' in o
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIfInstruction(o: any): o is IfInstruction {
  return o &&
    typeof o === 'object' &&
    'then' in o && Array.isArray(o.then)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIfElseInstruction(o: any): o is IfElseInstruction {
  return isIfInstruction(o) &&
    'else' in o && Array.isArray(o.else);
}

</script>

<template>
  <div v-for="instruction in instructions.entries()" :key="instruction[0]" class="card card-sm bg-neutral text-neutral-content m-2">
    <div class="card-body text-sm">
      
    </div>
  </div>
</template>

<style></style>
