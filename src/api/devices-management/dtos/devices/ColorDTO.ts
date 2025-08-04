
import { Color } from "@/model/devices-management/Types";
import { Deserializer } from "../../../Deserializer";

export interface ColorDTO {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export function isColorDTO(o: unknown): o is ColorDTO {
  return o != undefined && typeof o == "object" &&
    "r" in o && typeof o.r == "number" &&
    "g" in o && typeof o.g == "number" &&
    "b" in o && typeof o.b == "number"
}

export const colorDeserializer =
  Deserializer<ColorDTO, Color>(
    isColorDTO,
    (dto) => Color(dto.r, dto.g, dto.b),
    (obj) => `Unable to deserialize ${obj} into a Color since it was not a ColorDTO`
  )
