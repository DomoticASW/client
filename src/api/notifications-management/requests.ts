import type { DeviceId } from "@/model/devices-management/Device"
import { authorizedRequest, deserializeBody } from "../api"
import type { SubscribeForDeviceOfflineNotificationsDTO } from "./dtos/SubscribeForDeviceOfflineNotificationsDTO"
import { booleanDeserializer } from "../Deserializer"

export async function subscribeForDeviceOfflineNotifications(deviceId: DeviceId, token: string): Promise<void> {
  const body: SubscribeForDeviceOfflineNotificationsDTO = { deviceId }
  await authorizedRequest(`/api/notifications`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function unsubscribeForDeviceOfflineNotifications(deviceId: DeviceId, token: string): Promise<void> {
  await authorizedRequest(`/api/notifications/${deviceId}`, token, { method: 'DELETE' })
}

export async function isSubscribedForDeviceOfflineNotifications(deviceId: DeviceId, token: string): Promise<boolean> {
  const response = await authorizedRequest(`/api/notifications/${deviceId}`, token)
  return await deserializeBody(response, booleanDeserializer)
}
