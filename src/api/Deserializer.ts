/**
 * A function which deserializes anything into a T
 */
export type Deserializer<T> = (json: unknown) => T

/**
 * Creates a deserializer.
 * @param checkDeserializable checks if the input is actually deserializable into the expected output type
 * @param deserialize deserializes the input into the output type
 * @param deserializationError an optional function that produces the `cause` field of a DeserializeError
 * @throws DeserializeError if `checkDeserializable` fails
 */
export function Deserializer<From, To>(
  checkDeserializable: (obj: unknown) => obj is From,
  deserialize: (obj: From) => To,
  deserializationError?: (obj: unknown) => string
): Deserializer<To> {
  return (json) => {
    if (checkDeserializable(json)) {
      return deserialize(json)
    } else {
      throw DeserializeError(deserializationError ? deserializationError(json) : undefined)
    }
  }
}

export function arrayDeserializer<T>(itemDeserializer: Deserializer<T>): Deserializer<T[]> {
  return (obj) => {
    if (!Array.isArray(obj)) {
      throw DeserializeError(`Expecting an array but ${typeof obj} was found`)
    }
    return obj.map((item) => itemDeserializer(item))
  }
}

function isBoolean(o: unknown): o is boolean {
  return o != undefined && typeof o == 'boolean'
}
export const booleanDeserializer: Deserializer<boolean> = Deserializer(
  isBoolean,
  (obj) => obj,
  (obj) => `Expecting a boolean but ${typeof obj} was found`
)

export interface DeserializeError {
  message: string
  cause?: string
}

export function DeserializeError(cause?: string): DeserializeError {
  return {
    message: 'There was an error while deserializing a response from the server.',
    cause,
  }
}
