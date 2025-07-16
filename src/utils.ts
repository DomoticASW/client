/**
 * Sets the Authorization header to token if it is not already set.
 * Sets the Content-Type header to "application/json" if it is not already set.
 */
export async function authorizedRequest(input: RequestInfo | URL, token: string, init?: RequestInit): Promise<{ response: Response, json: object }> {
  const headers = new Headers(init?.headers) // Enuring that the type of init.headers is Headers
  if (!headers.has("Authorization")) {
    headers.append("Authorization", token)
  }
  return await request(input, { ...init, headers })
}

/**
 * Sets the Content-Type header to "application/json" if it is not already set.
 */
export async function request(input: RequestInfo | URL, init?: RequestInit): Promise<{ response: Response, json: object }> {
  const headers = new Headers(init?.headers) // Enuring that the type of init.headers is Headers
  if (!headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json")
  }
  const response = await fetch(input, init)
  return { response, json: await response.json() }
}
