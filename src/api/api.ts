import { DeserializeError, type Deserializer } from './Deserializer'
import { toServerErrorDeserializer } from './ServerError'

/**
 * Does the same as `request` plus setting the Authorization header to token if it is not already set.
 */
export async function authorizedRequest(
  url: RequestInfo | URL,
  token: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers) // Ensuring that the type of init.headers is Headers
  if (!headers.has('Authorization')) {
    headers.append('Authorization', token)
  }
  return await request(url, { ...init, headers })
}

/**
 * Sends a request to the specified url.
 * Sets the Content-Type header to "application/json" if it is not already set.
 *
 * @throws a ServerError if the response status code is not successfull (2xx)
 * @throws A DeserializeError if the response indicates a failure and the body cannot be deserialized into a ServerError
 */
export async function request(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers) // Ensuring that the type of init.headers is Headers
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json')
  }
  const response = await fetch(url, { ...init, headers })
  if (!response.ok) {
    throw await deserializeBody(response, toServerErrorDeserializer)
  }
  return response
}

/**
 * Deserializes the response body if present using the given deserializer.
 *
 * @throws a ServerError if the response status code is not successfull (2xx)
 * @throws A DeserializeError body cannot be correctly deserialized or if it's empty
 */
export async function deserializeBody<T>(res: Response, deserializer: Deserializer<T>): Promise<T> {
  // Passing through a text representation as res.json() uses JSON.parse and will fail in case of empty body
  const bodyAsText = await res.text()
  if (bodyAsText.trim().length == 0) {
    throw DeserializeError('Response body was empty')
  }

  let body: object
  try {
    body = JSON.parse(bodyAsText)
  } catch (e) {
    throw DeserializeError('Unable to parse json from response body.\n' + (e as Error).message)
  }

  if (!res.ok) {
    throw toServerErrorDeserializer(body)
  }
  return deserializer(body)
}
