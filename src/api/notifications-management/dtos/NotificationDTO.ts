import { Deserializer } from '@/api/Deserializer'
import type { Notification } from '@/model/notifications-management/Notification'

export interface NotificationDTO {
  readonly message: string
}

export function isNotificationDTO(o: unknown): o is NotificationDTO {
  return o != undefined && typeof o == 'object' && 'message' in o && typeof o.message == 'string'
}

export const notificationDeserializer = Deserializer<NotificationDTO, Notification>(
  isNotificationDTO,
  (dto) => ({ message: dto.message }),
  (obj) => `Unable to deserialize ${obj} into a Notification since it was not a NotificationDTO`
)
