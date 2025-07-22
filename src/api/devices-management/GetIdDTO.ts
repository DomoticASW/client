import { Deserializer } from "../Deserializer";

export interface GetIdDTO {
  id: string
}

export function isGetIdDTO(o: unknown): o is GetIdDTO {
  return o != undefined && typeof o == "object" &&
    "id" in o && typeof o.id == "string"
}

export const idDeserializer =
  Deserializer<GetIdDTO, string>(
    isGetIdDTO,
    (dto) => dto.id,
    (obj) => `Unable to deserialize ${obj} into a string id since it was not a GetIdDTO`
  )
