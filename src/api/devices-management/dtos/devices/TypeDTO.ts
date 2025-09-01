import { Deserializer } from '../../../Deserializer'
import { Type } from '@/model/Type'

export enum TypeDTO {
  IntType = 'IntType',
  DoubleType = 'DoubleType',
  BooleanType = 'BooleanType',
  ColorType = 'ColorType',
  StringType = 'StringType',
  VoidType = 'VoidType',
}

export function isTypeDTO(o: unknown): o is TypeDTO {
  return o != undefined && typeof o == 'string' && Object.values(TypeDTO).includes(o as TypeDTO)
}

export const typeDeserializer = Deserializer<TypeDTO, Type>(
  isTypeDTO,
  (dto) => {
    switch (dto) {
      case TypeDTO.IntType:
        return Type.IntType
      case TypeDTO.DoubleType:
        return Type.DoubleType
      case TypeDTO.BooleanType:
        return Type.BooleanType
      case TypeDTO.ColorType:
        return Type.ColorType
      case TypeDTO.StringType:
        return Type.StringType
      case TypeDTO.VoidType:
        return Type.VoidType
    }
  },
  (obj) => `Unable to deserialize ${obj} into a Type since it was not a TypeDTO`
)
