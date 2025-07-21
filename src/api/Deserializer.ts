// TODO: add doc
export type Deserializer<T> = (json: object) => T

export function Deserializer<From, To>(
  checkDeserializable: (obj: unknown) => obj is From,
  deserialize: (obj: From) => To,
  deserializationError?: (obj: unknown) => string): Deserializer<To> {

  return (json) => {
    if (checkDeserializable(json)) {
      return deserialize(json)
    } else {
      throw DeserializeError(deserializationError ? deserializationError(json) : undefined)
    }
  }
}

export interface DeserializeError {
  message: string
  cause?: string
}

export function DeserializeError(cause?: string): DeserializeError {
  return {
    message: "There was an error while deserializing a response from the server.",
    cause
  }
}
