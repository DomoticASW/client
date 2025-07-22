import { authorizedRequest, deserializeBody } from "@/api/api"
import { deviceDeserializer } from "../GetDeviceDTO"
import type { Device } from "@/model/devices-management/Device"
import { arrayDeserializer } from "@/api/Deserializer"
import type { DiscoveredDevice } from "@/model/devices-management/DiscoveredDevice"

export async function renameDevice(id: string, newName: string, token: string): Promise<void> {
  await authorizedRequest(`/api/devices/${id}`, token, {
    method: 'POST',
    body: JSON.stringify({ name: newName }),
  })
}

export async function deleteDevice(id: string, token: string): Promise<void> {
  await authorizedRequest(`/api/devices/${id}`, token, { method: 'DELETE' })
}

export async function registerDevice(host: string, port: number, token: string): Promise<void> {
  await authorizedRequest('/api/devices', token, {
    method: 'POST',
    body: JSON.stringify({ deviceAddress: { host, port } }),
  })
}

export async function findDevice(id: string, token: string): Promise<Device> {
  const res = await authorizedRequest(`/api/devices/${id}`, token)
  return await deserializeBody(res, deviceDeserializer)
}

export async function getAllDevices(token: string): Promise<Device[]> {
  const res = await authorizedRequest(`/api/devices`, token)
  return await deserializeBody(res, arrayDeserializer(deviceDeserializer))
}

export async function getAllDiscoveredDevices(token: string): Promise<DiscoveredDevice[]> {
  const res = await authorizedRequest(`/api/discovered-devices`, token)
  return await deserializeBody(res, arrayDeserializer(deviceDeserializer))
}
