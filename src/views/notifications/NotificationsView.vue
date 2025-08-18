<script setup lang="ts">
import NavbarLayout from '@/components/NavbarLayout.vue'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()

const notifications = notificationsStore.notifications
</script>

<template>
  <NavbarLayout title="Notifications" :show-back-button="false">
    <ul class="list rounded-box" v-if="notifications">
      <li class="list-row" v-for="(notification, idx) in notifications" :key="idx">
        <span class="list-col-grow">{{ notification.message }}</span>

        <button
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-eye-slash fa-lg !flex"
        ></button>

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
