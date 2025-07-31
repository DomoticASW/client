import type {
  IfInstruction,
  IfElseInstruction,
  WaitInstruction,
  StartTaskInstruction,
  CreateConstantInstruction,
  SendNotificationInstruction,
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
    seconds: 0,
  }
}

export function EmptyStartTaskInstruction(): StartTaskInstruction {
  return {
    taskId: 'Choose a task',
  }
}

export function EmtpyConstantInstruction(): CreateConstantInstruction {
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
