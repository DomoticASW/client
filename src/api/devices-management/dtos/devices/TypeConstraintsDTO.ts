import { DeserializeError, Deserializer } from "../../../Deserializer";
import { DoubleRange, Enum, IntRange, NoneBoolean, NoneColor, NoneDouble, NoneInt, NoneString, NoneVoid, type TypeConstraints } from "@/model/devices-management/Types";
import { TypeDTO } from "./TypeDTO";

export type TypeConstraintsDTO = EnumDTO | IntRangeDTO | DoubleRangeDTO | NoneDTO
export interface EnumDTO {
  readonly __brand: "Enum"
  readonly type: TypeDTO.StringType
  readonly values: string[]
}
export interface IntRangeDTO {
  readonly __brand: "IntRange"
  readonly type: TypeDTO.IntType
  readonly min: number
  readonly max: number
}
export interface DoubleRangeDTO {
  readonly __brand: "DoubleRange"
  readonly type: TypeDTO.DoubleType
  readonly min: number
  readonly max: number
}
export interface NoneDTO {
  readonly __brand: "None"
  readonly type: TypeDTO
}

export function isTypeConstraintsDTO(o: unknown): o is TypeConstraintsDTO {
  return isEnumTypeConstraintsDTO(o) ||
    isIntRangeTypeConstraintsDTO(o) ||
    isDoubleRangeTypeConstraintsDTO(o) ||
    isNoneTypeConstraintsDTO(o)
}

function isEnumTypeConstraintsDTO(o: unknown): o is EnumDTO {
  return o != undefined && typeof o == "object" &&
    "__brand" in o && typeof o.__brand == "string" && o.__brand == "Enum" &&
    "type" in o && typeof o.type == "string" && o.type == TypeDTO.StringType &&
    "values" in o && Array.isArray(o.values) && o.values.every(v => typeof v == "string")
}
function isIntRangeTypeConstraintsDTO(o: unknown): o is IntRangeDTO {
  return o != undefined && typeof o == "object" &&
    "__brand" in o && typeof o.__brand == "string" && o.__brand == "IntRange" &&
    "type" in o && typeof o.type == "string" && o.type == TypeDTO.IntType &&
    "min" in o && typeof o.min == "number" &&
    "max" in o && typeof o.max == "number"
}
function isDoubleRangeTypeConstraintsDTO(o: unknown): o is DoubleRangeDTO {
  return o != undefined && typeof o == "object" &&
    "__brand" in o && typeof o.__brand == "string" && o.__brand == "DoubleRange" &&
    "type" in o && typeof o.type == "string" && o.type == TypeDTO.DoubleType &&
    "min" in o && typeof o.min == "number" &&
    "max" in o && typeof o.max == "number"
}
function isNoneTypeConstraintsDTO(o: unknown): o is NoneDTO {
  return o != undefined && typeof o == "object" &&
    "__brand" in o && typeof o.__brand == "string" && o.__brand == "None" &&
    "type" in o && typeof o.type == "string" && Object.values(TypeDTO).some(t => t == o.type)
}


export const typeConstraintsDeserializer =
  Deserializer<TypeConstraintsDTO, TypeConstraints<unknown>>(
    isTypeConstraintsDTO,
    (dto) => {
      if (isIntRangeTypeConstraintsDTO(dto)) { return IntRange(dto.min, dto.max) }
      else if (isDoubleRangeTypeConstraintsDTO(dto)) { return DoubleRange(dto.min, dto.max) }
      else if (isEnumTypeConstraintsDTO(dto)) { return Enum(new Set(dto.values)) }
      else if (isNoneTypeConstraintsDTO(dto)) {
        switch (dto.type) {
          case TypeDTO.BooleanType: return NoneBoolean()
          case TypeDTO.IntType: return NoneInt()
          case TypeDTO.DoubleType: return NoneDouble()
          case TypeDTO.StringType: return NoneString()
          case TypeDTO.ColorType: return NoneColor()
          case TypeDTO.VoidType: return NoneVoid()
        }
      } else {
        throw DeserializeError("It was not possible to serialize a TypeConstraintsDTO into any of [IntRangeDTO, DoubleRangeDTO, EnumDTO, NoneDTO]")
      }
    },
    (obj) => `Unable to deserialize ${obj} into a TypeConstraints since it was not a TypeConstraintsDTO`
  )
