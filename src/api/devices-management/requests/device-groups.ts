import { authorizedRequest, deserializeBody } from "@/api/api"
import { arrayDeserializer } from "@/api/Deserializer"
import { DeviceGroupId, type DeviceGroup } from "@/model/devices-management/DeviceGroup"
import { deviceGroupDeserializer } from "../dtos/GetDeviceGroupDTO"
import { idDeserializer } from "../../GetIdDTO"
import type { DeviceId } from "@/model/devices-management/Device"

export async function createDeviceGroup(name: string, token: string): Promise<DeviceGroupId> {
  const res = await authorizedRequest(`/api/deviceGroups`, token, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  const idDTO = await deserializeBody(res, idDeserializer)
  return DeviceGroupId(idDTO)
}

export async function renameDeviceGroup(id: DeviceGroupId, newName: string, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${id}`, token, {
    method: 'POST',
    body: JSON.stringify({ name: newName }),
  })
}

export async function deleteDeviceGroup(id: DeviceGroupId, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${id}`, token, { method: 'DELETE' })
}

export async function addDeviceToDeviceGroup(groupId: DeviceGroupId, deviceId: DeviceId, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${groupId}/device`, token, {
    method: 'POST',
    body: JSON.stringify({ deviceId }),
  })
}

export async function removeDeviceFromDeviceGroup(groupId: DeviceGroupId, deviceId: DeviceId, token: string): Promise<void> {
  await authorizedRequest(`/api/deviceGroups/${groupId}/device/${deviceId}`, token, {
    method: 'DELETE',
  })
}

export async function findDeviceGroup(id: DeviceGroupId, token: string): Promise<DeviceGroup> {
  const res = await authorizedRequest(`/api/deviceGroups/${id}`, token)
  return await deserializeBody(res, deviceGroupDeserializer)
}

export async function getAllDeviceGroups(token: string): Promise<DeviceGroup[]> {
  const res = await authorizedRequest(`/api/deviceGroups`, token)
  return await deserializeBody(res, arrayDeserializer(deviceGroupDeserializer))
}
