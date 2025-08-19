<script setup lang="ts">
import NavbarLayout from '@/components/NavbarLayout.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { onMounted, ref } from 'vue'

const notificationsStore = useNotificationsStore()

const notifications = notificationsStore.notifications

const notificationRefs = ref<Element[]>([])

let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute('data-index')
          const idx = Number(index)
          if (Number.isFinite(idx)) {
            const notification = notifications[idx]
            if (!notification.read) {
              notificationsStore.setNotificationRead(idx, true)
              observer.unobserve(entry.target)
            }
          }
        }
      })
    },
    {
      threshold: 0.5, //50% of the element must be visible to be intersecting the viewport
    },
  )

  notificationRefs.value.forEach((el) => {
    if (el) observer.observe(el)
  })
})
</script>

<template>
  <NavbarLayout title="Notifications" :show-back-button="false">
    <ul class="list rounded-box" v-if="notifications">
      <li
        class="list-row"
        v-for="(notification, idx) in notifications"
        :key="idx"
        :data-index="idx"
        :ref="(el) => notificationRefs.push(el as Element)"
      >
        <span class="list-col-grow">{{ notification.message }}</span>

        <button
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-close fa-lg !flex"
          @click="notificationsStore.deleteNotification(idx)"
          :aria-label="'Delete notification number ' + idx"
        ></button>
      </li>
    </ul>
  </NavbarLayout>
</template>
