import type { DeviceId } from "@/model/devices-management/Device"
import type { Notification } from "@/model/notifications-management/Notification"
import { authorizedRequest, deserializeBody } from "../api"
import type { SubscribeForDeviceOfflineNotificationsDTO } from "./dtos/SubscribeForDeviceOfflineNotificationsDTO"
import { notificationDeserializer, type NotificationDTO } from "./dtos/NotificationDTO"
import { booleanDeserializer } from "../Deserializer"
import { io, type Socket } from "socket.io-client"

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

export function openSocketIOForNotifications(email: string, onReceivedNotification: (notification: Notification) => void): Socket {
  const socket = io()
    .on('connect', () => socket.emit('login', { email: email }))
    .on('notification', (data: NotificationDTO) => {
      onReceivedNotification(notificationDeserializer(data))
    })
  return socket
}
