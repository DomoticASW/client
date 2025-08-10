import { authorizedRequest, deserializeBody } from "@/api/api"
import { deviceDeserializer } from "../dtos/devices/DeviceDTO"
import { discoveredDeviceDeserializer } from "../dtos/devices/DiscoveredDeviceDTO"
import { arrayDeserializer } from "@/api/Deserializer"
import type { Device, DeviceActionId, DeviceAddress, DeviceId } from "@/model/devices-management/Device"
import type { DiscoveredDevice } from "@/model/devices-management/DiscoveredDevice"
import type { RenameDeviceDTO } from "../dtos/devices/RenameDeviceDTO"
import type { RegisterDeviceDTO } from "../dtos/devices/RegisterDeviceDTO"
import type { ExecuteDeviceActionDTO } from "../dtos/devices/ExecuteDeviceActionDTO"

export async function renameDevice(id: DeviceId, newName: string, token: string): Promise<void> {
  const body: RenameDeviceDTO = { name: newName }
  await authorizedRequest(`/api/devices/${id}`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function deleteDevice(id: DeviceId, token: string): Promise<void> {
  await authorizedRequest(`/api/devices/${id}`, token, { method: 'DELETE' })
}

export async function registerDevice(deviceAddress: DeviceAddress, token: string): Promise<void> {
  const body: RegisterDeviceDTO = { deviceAddress }
  await authorizedRequest('/api/devices', token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function findDevice(id: DeviceId, token: string): Promise<Device> {
  const res = await authorizedRequest(`/api/devices/${id}`, token)
  return await deserializeBody(res, deviceDeserializer)
}

export async function getAllDevices(token: string): Promise<Device[]> {
  const res = await authorizedRequest(`/api/devices`, token)
  return await deserializeBody(res, arrayDeserializer(deviceDeserializer))
}

export async function getAllDiscoveredDevices(token: string): Promise<DiscoveredDevice[]> {
  const res = await authorizedRequest(`/api/discovered-devices`, token)
  return await deserializeBody(res, arrayDeserializer(discoveredDeviceDeserializer))
}

export async function executeAction(deviceId: DeviceId, actionId: DeviceActionId, input: unknown | undefined, token: string): Promise<void> {
  const body: ExecuteDeviceActionDTO = { input }
  await authorizedRequest(`/api/devices/${deviceId}/actions/${actionId}/execute`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
