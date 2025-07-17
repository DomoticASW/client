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
  CreateDevicePropertyConstantInstruction('Roomba', 'Battery', 'Battery'),
  CreateConstantInstruction('Critical battery level'),
  IfElseInstruction(
    'Battery',
    'Critical battery level',
    Operator.GREATER,
    [
      DeviceActionInstruction('Roomba', 'Start', EmptyConstraint(Type.VoidType), undefined),
      CreateConstantInstruction('High battery level'),
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
  name: string
}

interface CreateDevicePropertyConstantInstruction extends ConstantInstruction {
  deviceName: string
  property: string
}

interface IfInstruction {
  left: string
  right: string
  operator: Operator
  thenInstructions: Instruction[]
}

interface IfElseInstruction extends IfInstruction {
  elseInstructions: Instruction[]
}

interface DeviceActionInstruction {
  deviceName: string
  action: string
  typeConstraints: TypeConstraints
  input: unknown
}

interface SendNotificationInstruction {
  name: string
  message: string
}

function CreateDevicePropertyConstantInstruction(
  deviceName: string,
  property: string,
  name: string,
): CreateDevicePropertyConstantInstruction {
  return {
    deviceName: deviceName,
    property: property,
    name: name,
  }
}

function CreateConstantInstruction(name: string): ConstantInstruction {
  return { name: name }
}

function IfInstruction(
  left: string,
  right: string,
  operator: Operator,
  thenInstructions: Instruction[],
): IfInstruction {
  return {
    left: left,
    right: right,
    operator: operator,
    thenInstructions: thenInstructions,
  }
}

function IfElseInstruction(
  left: string,
  right: string,
  operator: Operator,
  thenInstructions: Instruction[],
  elseInstructions: Instruction[],
): IfElseInstruction {
  return {
    left: left,
    right: right,
    operator: operator,
    thenInstructions: thenInstructions,
    elseInstructions: elseInstructions,
  }
}

function DeviceActionInstruction(
  deviceName: string,
  action: string,
  typeConstraints: TypeConstraints,
  input: unknown,
): DeviceActionInstruction {
  return {
    deviceName: deviceName,
    action: action,
    typeConstraints: typeConstraints,
    input: input,
  }
}

function SendNotificationInstruction(name: string, message: string): SendNotificationInstruction {
  return {
    name: name,
    message: message,
  }
}
</script>

<template>
  <div class="card bg-neutral text-neutral-content w-96">
    <div class="card-body"></div>
  </div>
</template>

<style></style>
