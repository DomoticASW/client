import { Deserializer } from './Deserializer'

export interface ServerError {
  __brand: string
  message: string
  cause?: string
}

export function isServerError(o: unknown): o is ServerError {
  return (
    o != undefined &&
    typeof o == 'object' &&
    '__brand' in o &&
    typeof o.__brand == 'string' &&
    'message' in o &&
    typeof o.message == 'string'
  )
}

export const toServerErrorDeserializer: Deserializer<ServerError> = Deserializer(
  isServerError,
  (obj) => ({ __brand: obj.__brand, message: obj.message, cause: obj.cause })
)
