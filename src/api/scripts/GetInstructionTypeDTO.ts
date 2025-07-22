import { InstructionType } from "@/model/scripts/Instruction"
import { Deserializer } from "../Deserializer"

export enum GetInstructionTypeDTO {
  SendNotificationInstruction = 'SendNotificationInstruction',
  WaitInstruction = 'WaitInstruction',
  StartTaskInstruction = 'StartTaskInstruction',
  DeviceActionInstruction = 'DeviceActionInstruction',
  CreateConstantInstruction = 'CreateConstantInstruction',
  CreateDevicePropertyConstantInstruction = 'CreateDevicePropertyConstantInstruction',
  IfInstruction = 'IfInstruction',
  IfElseInstruction = 'IfElseInstruction'
}

export function isGetInstructionTypeDTO(o: unknown): o is GetInstructionTypeDTO {
  return (
    o !== undefined &&
    typeof o == 'string' &&
    Object.values(GetInstructionTypeDTO).some(el => el === o)
  )
}

export const deviceAddressDeserializer = Deserializer<GetInstructionTypeDTO, InstructionType>(isGetInstructionTypeDTO, (dto) => {
  return Object.values(InstructionType).find(el => el === dto.valueOf())!
})
