import type { Notification } from "@/model/notifications-management/Notification";
import { openSocketIOForNotifications } from "@/api/notifications-management/requests";
import { defineStore } from "pinia";

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: new Array<Notification & { read: boolean }>()
  }),
  actions: {
    init(userEmail: string) {
      openSocketIOForNotifications(userEmail, (n) => {
        this.notifications.push({ ...n, read: false })
        // TODO: remove after implementing notifications page
        console.log(`Received notification: ${n.message}`)
      })
    },
    setNotificationRead(index: number, read: boolean) {
      this.notifications[index].read = read
    },
    deleteNotification(index: number) {
      this.notifications.splice(index)
    }
  },
})
