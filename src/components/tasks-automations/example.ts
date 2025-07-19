import { ref } from 'vue'
import {
  Operator,
  Type,
  type ConstantInstruction,
  type Enum,
  type Instruction,
  type TypeConstraints,
  type CreateDevicePropertyConstantInstruction,
  type IfInstruction,
  type IfElseInstruction,
  type DeviceActionInstruction,
  type SendNotificationInstruction,
} from '@/components/tasks-automations/types'

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

// To remove when getting instructions from server, will only be necessary the isXInstruction to deserialize the instructions, but has to do better checks
export const instructions = ref([
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
      SendNotificationInstruction('Emma', 'The Roomba stopped'),
    ],
  ),
])

function CreateDevicePropertyConstantInstruction(
  deviceId: string,
  devicePropertyId: string,
  name: string,
  value: unknown,
): CreateDevicePropertyConstantInstruction {
  return {
    deviceId: deviceId,
    devicePropertyId: devicePropertyId,
    name: name,
    value: value,
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

export const trigger = {
    start: new Date(),
    periodSeconds: 7202
  }

export function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const aa = String(date.getFullYear()).slice(-2); // Get last two digits of year
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${dd}/${mm}/${aa} ${hh}:${min}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  }

  return parts.join(' ');
}
