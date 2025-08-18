import type { Notification } from "@/model/notifications-management/Notification";
import { openSocketIOForNotifications } from "@/api/notifications-management/requests";
import { defineStore } from "pinia";
import { useUserInfoStore } from "./user-info";
import { ref } from "vue";
import { Socket } from "socket.io-client";

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref(new Array<Notification & { read: boolean }>())
  const stored = localStorage.getItem('notifications')
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      notifications.value = parsed;
    } catch (e) {
      console.error("Failed to parse stored notifications", e);
    }
  }
  const socket = ref<Socket | undefined>()

  const userInfo = useUserInfoStore()
  if (userInfo.token) {
    openSocket(userInfo.email)
  }
  userInfo.$subscribe((_, state) => {
    if (state.userInfo.token && !socket.value) {
      openSocket(state.userInfo.email)
    } else if (!state.userInfo.token && socket.value) {
      closeSocketAndResetNotifications()
    }
  })
  window.addEventListener('beforeunload', closeSocket)
  function openSocket(email: string) {
    if (socket.value) { socket.value.close() }
    socket.value = openSocketIOForNotifications(email, (notification) => {
      notifications.value.push({ ...notification, read: false })
      localStorage.setItem('notifications', JSON.stringify(notifications.value));
    })
  }
  function closeSocket() {
    socket.value?.close()
    socket.value = undefined
  }
  function closeSocketAndResetNotifications() {
    closeSocket()
    localStorage.removeItem('notifications')
    notifications.value = []
  }
  function setNotificationRead(index: number, read: boolean) {
    notifications.value[index].read = read
    localStorage.setItem('notifications', JSON.stringify(notifications.value));
  }
  function deleteNotification(index: number) {
    notifications.value.splice(index, 1)
    localStorage.setItem('notifications', JSON.stringify(notifications.value));
  }
  return { notifications, socket, setNotificationRead, deleteNotification }
})
