import { InstructionType } from '@/model/scripts/Instruction'
import { Deserializer } from '../../Deserializer'

export enum GetInstructionTypeDTO {
  SendNotificationInstruction = 'SendNotificationInstruction',
  WaitInstruction = 'WaitInstruction',
  StartTaskInstruction = 'StartTaskInstruction',
  DeviceActionInstruction = 'DeviceActionInstruction',
  CreateConstantInstruction = 'CreateConstantInstruction',
  CreateDevicePropertyConstantInstruction = 'CreateDevicePropertyConstantInstruction',
  IfInstruction = 'IfInstruction',
  IfElseInstruction = 'IfElseInstruction',
}

export function isGetInstructionTypeDTO(o: unknown): o is GetInstructionTypeDTO {
  return (
    o != undefined &&
    typeof o == 'string' &&
    Object.values(GetInstructionTypeDTO).includes(o as GetInstructionTypeDTO)
  )
}

export const instructionTypeDeserializer = Deserializer<GetInstructionTypeDTO, InstructionType>(
  isGetInstructionTypeDTO,
  (dto) => {
    switch (dto) {
      case GetInstructionTypeDTO.CreateConstantInstruction:
        return InstructionType.CreateConstantInstruction
      case GetInstructionTypeDTO.CreateDevicePropertyConstantInstruction:
        return InstructionType.CreateDevicePropertyConstantInstruction
      case GetInstructionTypeDTO.DeviceActionInstruction:
        return InstructionType.DeviceActionInstruction
      case GetInstructionTypeDTO.IfInstruction:
        return InstructionType.IfInstruction
      case GetInstructionTypeDTO.IfElseInstruction:
        return InstructionType.IfElseInstruction
      case GetInstructionTypeDTO.SendNotificationInstruction:
        return InstructionType.SendNotificationInstruction
      case GetInstructionTypeDTO.StartTaskInstruction:
        return InstructionType.StartTaskInstruction
      case GetInstructionTypeDTO.WaitInstruction:
        return InstructionType.WaitInstruction
    }
  }
)
