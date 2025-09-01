import { Deserializer } from '../../Deserializer'

export interface GetTokenDTO {
  source: string
}

export function isGetTokenDTO(o: unknown): o is GetTokenDTO {
  return o != undefined && typeof o == 'object' && 'source' in o && typeof o.source == 'string'
}

export const tokenDeserializer = Deserializer<GetTokenDTO, string>(
  isGetTokenDTO,
  (dto) => dto.source,
  (obj) => `Unable to deserialize ${obj} into a string since it was not a GetTokenDTO`
)
