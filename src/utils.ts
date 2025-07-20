/**
 * Sets the Authorization header to token if it is not already set.
 * Sets the Content-Type header to "application/json" if it is not already set.
 */
export async function authorizedRequest(input: RequestInfo | URL, token: string, init?: RequestInit): Promise<{ response: Response, json: object | undefined }> {
  const headers = new Headers(init?.headers) // Ensuring that the type of init.headers is Headers
  if (!headers.has("Authorization")) {
    headers.append("Authorization", token)
  }
  return await request(input, { ...init, headers })
}

/**
 * Sets the Content-Type header to "application/json" if it is not already set.
 */
export async function request(input: RequestInfo | URL, init?: RequestInit): Promise<{ response: Response, json: object | undefined }> {
  const headers = new Headers(init?.headers) // Ensuring that the type of init.headers is Headers
  if (!headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json")
  }
  const response = await fetch(input, { ...init, headers })
  // Passing through a text representation as JSON.parse will fail in case of empty body
  const bodyAsText = await response.text()
  const body: object | undefined = bodyAsText ? JSON.parse(bodyAsText) : undefined
  if (!response.ok) {
    throw (body as ServerError)
  }
  return { response, json: body }
}

export interface ServerError {
  __brand: string
  message: string
  cause?: string
}
