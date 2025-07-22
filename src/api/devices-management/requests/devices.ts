import { authorizedRequest, deserializeBody } from "@/api/api"
import { deviceDeserializer } from "../dtos/DeviceDTO"
import { discoveredDeviceDeserializer } from "../dtos/DiscoveredDeviceDTO"
import { arrayDeserializer } from "@/api/Deserializer"
import type { Device, DeviceAddress, DeviceId } from "@/model/devices-management/Device"
import type { DiscoveredDevice } from "@/model/devices-management/DiscoveredDevice"
import type { RenameDeviceDTO } from "../dtos/RenameDeviceDTO"
import type { RegisterDeviceDTO } from "../dtos/RegisterDeviceDTO"

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
