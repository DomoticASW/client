export async function authorizedRequest(
  input: RequestInfo | URL,
  token: string,
  init?: RequestInit,
): Promise<{ response: Response; json: object }> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Authorization')) {
    headers.append('Authorization', token)
  }
  return await request(input, { ...init, headers })
}

export async function request(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{ response: Response; json: object }> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json')
  }
  const response = await fetch(input, init)
  const json = await response.json().catch(() => {
    return null
  })
  return { response, json }
}
