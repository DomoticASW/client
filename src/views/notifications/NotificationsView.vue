<script setup lang="ts">
import NavbarLayout from '@/components/NavbarLayout.vue'
import { formatDate } from '@/components/tasks-automations/timeUtils'
import { useNotificationsStore } from '@/stores/notifications'
import { onUnmounted, ref } from 'vue'

const notificationsStore = useNotificationsStore()

const notifications = notificationsStore.notifications
const readNotification = ref<boolean[]>([])

const notificationRefs = ref<Element[]>([])

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = entry.target.getAttribute('data-index')
        const idx = Number(index)
        if (Number.isFinite(idx)) {
          if (!readNotification.value[idx]) {
            readNotification.value[idx] = true
            observer.unobserve(entry.target)
          }
        }
      }
    })
  },
  {
    threshold: 1, //100% of the element must be visible to be intersecting the viewport
  },
)

function addToRefs(idx: number, el: Element) {
  notificationRefs.value[idx] = el as Element
  readNotification.value[idx] = notifications[idx].read
  observer.observe(notificationRefs.value[idx])
}

function deleteNotification(idx: number) {
  notificationsStore.deleteNotification(idx)
  observer.unobserve(notificationRefs.value[idx])
  notificationRefs.value.splice(idx, 1)
  readNotification.value.splice(idx, 1)
}

onUnmounted(() => {
  readNotification.value.forEach((r, idx) => notificationsStore.setNotificationRead(idx, r))
  observer.disconnect()
})
</script>

<template>
  <NavbarLayout title="Notifications" :show-back-button="false">
    <ul class="list rounded-box">
      <li
        class="indicator list-row grid w-full"
        v-for="(notification, idx) in notifications"
        :key="idx"
        :data-index="idx"
        :ref="(el) => el && addToRefs(idx, el as Element)"
      >
        <span class="self-center list-col-grow">{{ notification.message }}</span>
        <span class="self-end text-xs opacity-50">{{
          formatDate(new Date(notification.date))
        }}</span>
        <button
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-close fa-lg !flex"
          @click="deleteNotification(idx)"
          :aria-label="'Delete notification number ' + idx"
        ></button>
        <span class="indicator-item badge badge-primary" v-if="!notification.read">New</span>
      </li>
    </ul>
  </NavbarLayout>
</template>
