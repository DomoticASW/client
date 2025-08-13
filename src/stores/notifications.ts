import type { Notification } from "@/model/notifications-management/Notification";
import { openSocketIOForNotifications } from "@/api/notifications-management/requests";
import { defineStore } from "pinia";
import { useUserInfoStore } from "./user-info";
import { ref } from "vue";
import { Socket } from "socket.io-client";

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref(new Array<Notification & { read: boolean }>())
  const socket = ref<Socket | undefined>()

  const userInfo = useUserInfoStore()
  if (userInfo.token) {
    openSocket(userInfo.email)
  }
  userInfo.$subscribe((_, state) => {
    if (state.userInfo.token && !socket.value) {
      openSocket(state.userInfo.email)
    } else if (!state.userInfo.token && socket.value) {
      closeSocket()
    }
  })
  window.addEventListener('beforeunload', () => closeSocket())

  function openSocket(email: string) {
    if (socket.value) { socket.value.close() }
    socket.value = openSocketIOForNotifications(email, (notification) => {
      notifications.value.push({ ...notification, read: false })
      // TODO: remove after implementing notifications page
      console.log(`Received notification: ${notification.message}`)
    })
  }
  function closeSocket() {
    socket.value?.close()
    socket.value = undefined
  }
  function setNotificationRead(index: number, read: boolean) {
    notifications.value[index].read = read
  }
  function deleteNotification(index: number) {
    notifications.value.splice(index, 1)
  }
  return { notifications, socket, setNotificationRead, deleteNotification }
})
