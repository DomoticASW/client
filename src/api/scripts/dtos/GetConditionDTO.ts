import { ConditionOperatorType, type Condition } from '@/model/scripts/Instruction'
import { Deserializer } from '../../Deserializer'

export interface GetConditionDTO {
  leftConstantName: string
  rightConstantName: string
  negate: boolean
  conditionOperatorType: GetConditionOperatorTypeDTO
}

enum GetConditionOperatorTypeDTO {
  NumberEOperator = 'NumberEOperator',
  NumberGEOperator = 'NumberGEOperator',
  NumberLEOperator = 'NumberLEOperator',
  NumberLOperator = 'NumberLOperator',
  NumberGOperator = 'NumberGOperator',
  StringEOperator = 'StringEOperator',
  ColorEOperator = 'ColorEOperator',
  BooleanEOperator = 'BooleanEOperator',
}

function isGetConditionOperatorTypeDTO(o: unknown): o is GetConditionOperatorTypeDTO {
  return (
    o !== undefined &&
    typeof o === 'string' &&
    Object.values(GetConditionOperatorTypeDTO).some((el) => el.valueOf() === o)
  )
}

const conditionOperatorTypeDeserializer = Deserializer<
  GetConditionOperatorTypeDTO,
  ConditionOperatorType
>(isGetConditionOperatorTypeDTO, (dto) => {
  return Object.values(ConditionOperatorType).find((el) => el === dto.valueOf())!
})

export function isGetConditionDTO(o: unknown): o is GetConditionDTO {
  return (
    o != undefined &&
    typeof o === 'object' &&
    'leftConstantName' in o &&
    typeof o.leftConstantName === 'string' &&
    'rightConstantName' in o &&
    typeof o.rightConstantName === 'string' &&
    'negate' in o &&
    typeof o.negate === 'boolean' &&
    'conditionOperatorType' in o &&
    isGetConditionOperatorTypeDTO(o.conditionOperatorType)
  )
}

export const conditionDeserializer = Deserializer<GetConditionDTO, Condition>(
  isGetConditionDTO,
  (dto) => {
    return {
      leftConstantName: dto.leftConstantName,
      rightConstantName: dto.rightConstantName,
      negate: dto.negate,
      conditionOperatorType: conditionOperatorTypeDeserializer(dto.conditionOperatorType),
    }
  }
)
