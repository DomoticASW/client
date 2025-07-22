import { authorizedRequest, deserializeBody } from "@/api/api"
import { arrayDeserializer } from "@/api/Deserializer"
import type { DeviceGroup } from "@/model/devices-management/DeviceGroup"
import { deviceGroupDeserializer } from "../GetDeviceGroupDTO"
import { idDeserializer } from "../GetIdDTO"

export async function createDeviceGroup(name: string, token: string): Promise<string> {
  const res = await authorizedRequest(`/api/deviceGroups`, token, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return await deserializeBody(res, idDeserializer)
}

export async function renameDeviceGroup(id: string, newName: string, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${id}`, token, {
    method: 'POST',
    body: JSON.stringify({ name: newName }),
  })
}

export async function deleteDeviceGroup(id: string, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${id}`, token, { method: 'DELETE' })
}

export async function addDeviceToDeviceGroup(groupId: string, deviceId: string, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${groupId}/device`, token, {
    method: 'POST',
    body: JSON.stringify({ deviceId }),
  })
}

export async function removeDeviceFromDeviceGroup(groupId: string, deviceId: string, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${groupId}/device/${deviceId}`, token, {
    method: 'DELETE',
  })
}

export async function findDeviceGroup(id: string, token: string): Promise<DeviceGroup> {
  const res = await authorizedRequest(`/api/deviceGroups/${id}`, token)
  return await deserializeBody(res, deviceGroupDeserializer)
}

export async function getAllDeviceGroups(token: string): Promise<DeviceGroup[]> {
  const res = await authorizedRequest(`/api/deviceGroups`, token)
  return await deserializeBody(res, arrayDeserializer(deviceGroupDeserializer))
}
