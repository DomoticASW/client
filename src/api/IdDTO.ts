import { Deserializer } from "./Deserializer";

export interface IdDTO {
  id: string
}

export function isIdDTO(o: unknown): o is IdDTO {
  return o != undefined && typeof o == "object" &&
    "id" in o && typeof o.id == "string"
}

export const idDeserializer =
  Deserializer<IdDTO, string>(
    isIdDTO,
    (dto) => dto.id,
    (obj) => `Unable to deserialize ${obj} into a string id since it was not an IdDTO`
  )
