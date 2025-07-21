import type { Deserializer } from "./Deserializer"
import type { ServerError } from "./ServerError"

export interface Request {
  url: RequestInfo | URL
  config?: RequestInit
}

/**
 * Does the same as `request` plus setting the Authorization header to token if it is not already set.
 */
export async function authorizedRequest<T>(req: Request, token: string, deserializer: Deserializer<T>): Promise<{ response: Response, body: T | undefined }> {
  const headers = new Headers(req.config?.headers) // Ensuring that the type of init.headers is Headers
  if (!headers.has("Authorization")) {
    headers.append("Authorization", token)
  }
  return await request({ url: req.url, config: { ...req.config, headers } }, deserializer)
}

/**
 * Sends a request to the specified req.url.
 * Sets the Content-Type header to "application/json" if it is not already set.
 * Deserializes the response body if present using the given deserializer.
 *
 * @throws a ServerError if the response status code is not successfull (2xx)
 * @throws A DeserializeError if the deserialization phase fails
 */
export async function request<T>(req: Request, deserializer: Deserializer<T>): Promise<{ response: Response, body: T | undefined }> {
  const headers = new Headers(req.config?.headers) // Ensuring that the type of init.headers is Headers
  if (!headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json")
  }
  const response = await fetch(req.url, { ...req.config, headers })
  // Passing through a text representation as JSON.parse will fail in case of empty body
  const bodyAsText = await response.text()
  const body: object | undefined = bodyAsText ? JSON.parse(bodyAsText) : undefined
  if (!response.ok) {
    throw (body as ServerError)
  }
  return { response, body: body ? deserializer(body) : undefined }
}
