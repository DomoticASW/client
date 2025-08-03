import * as api from '@/api/api';
import type { RegistrationRequest } from '@/model/users-management/RegistrationRequest';
import type { User } from '@/model/users-management/User';
import { tokenDeserializer } from '../dtos/GetTokenDTO';
import { userDeserializer } from '../dtos/GetUserDTO';
import { arrayDeserializer } from '@/api/Deserializer';

export async function userRegistrationRequest(registrationRequest: RegistrationRequest): Promise<void> {
    await api.request('/api/registrationRequests', {
      method: 'POST',
      body: JSON.stringify(registrationRequest)
    });
}

export async function updateUser(token: string, body: Record<string, string>): Promise<void> {
    await api.authorizedRequest('/api/users', token, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

export async function login(email: string, password: string): Promise<string> {
    const res = await api.request('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    return await api.deserializeBody(res, tokenDeserializer);
}

export async function getUser(token: string): Promise<User> {
    const res = await api.authorizedRequest('/api/user', token);
    return await api.deserializeBody(res, userDeserializer);
}

export async function getAllUsers(token: string): Promise<User[]> {
    const res = await api.authorizedRequest('/api/users', token);
    return await api.deserializeBody(res, arrayDeserializer(userDeserializer));
}