import * as api from '@/api/api'
import type {
  CompleteRegistrationRequest,
  RegistrationRequest,
} from '@/model/users-management/RegistrationRequest'
import type { User } from '@/model/users-management/User'
import { tokenDeserializer } from '../dtos/GetTokenDTO'
import { userDeserializer, usersDeserializer } from '../dtos/GetUserDTO'
import { arrayDeserializer } from '@/api/Deserializer'
import { registrationRequestDeserializer } from '../dtos/GetRegistrationRequestDTO'

export async function userRegistrationRequest(
  registrationRequest: CompleteRegistrationRequest
): Promise<void> {
  await api.request('/api/registrationRequests', {
    method: 'POST',
    body: JSON.stringify(registrationRequest),
  })
}

export async function updateUser(token: string, body: Record<string, string>): Promise<void> {
  await api.authorizedRequest('/api/users', token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteUser(token: string, email: string): Promise<void> {
  await api.authorizedRequest(`/api/users/${email}`, token, {
    method: 'DELETE',
  })
}

export async function rejectRegistrationRequest(token: string, email: string): Promise<void> {
  await api.authorizedRequest(`/api/registrationRequests/${email}/reject`, token, {
    method: 'POST',
  })
}

export async function approveRegistrationRequest(token: string, email: string): Promise<void> {
  await api.authorizedRequest(`/api/registrationRequests/${email}/approve`, token, {
    method: 'POST',
  })
}

export async function login(email: string, password: string): Promise<string> {
  const res = await api.request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return await api.deserializeBody(res, tokenDeserializer)
}

export async function getAllRegistrationRequests(token: string): Promise<RegistrationRequest[]> {
  const res = await api.authorizedRequest(`/api/registrationRequests`, token)
  return await api.deserializeBody(res, arrayDeserializer(registrationRequestDeserializer))
}

export async function getUser(token: string): Promise<User> {
  const res = await api.authorizedRequest('/api/user', token)
  return await api.deserializeBody(res, userDeserializer)
}

export async function getAllUsers(token: string): Promise<User[]> {
  const res = await api.authorizedRequest('/api/users', token)
  return await api.deserializeBody(res, usersDeserializer)
}
