import { Type } from "@/model/Type"
import { Deserializer } from "./Deserializer"

export enum GetTypeDTO {
    IntType = "IntType",
    DoubleType = "DoubleType",
    BooleanType = "BooleanType",
    ColorType = "ColorType",
    StringType = "StringType",
    VoidType = "VoidType"
}

export function isGetTypeDTO(o: unknown): o is GetTypeDTO {
  return (
    o !== undefined &&
    typeof o == 'string' &&
    Object.values(GetTypeDTO).some(el => el === o)
  )
}

export const typeDeserializer = Deserializer<GetTypeDTO, Type>(isGetTypeDTO, (dto) => {
  return Object.values(Type).find(el => el === dto.valueOf())!
})
