<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  DeviceActionId,
  DeviceId,
  type Device,
  type DeviceAction,
} from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import * as api from '@/api/devices-management/requests/devices'
import * as notificationsApi from '@/api/notifications-management/requests'

const props = defineProps({ id: { type: String, required: true } })
const deviceId = DeviceId(props.id)
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()

const device = ref<Device | undefined>(undefined)
const isSubscribedForOfflineNotifications = ref<boolean | undefined>(undefined)

const actionsToShow = computed<DeviceAction<undefined>[] | undefined>(() => {
  const d = device.value
  if (d) {
    return d.actions.filter((a) => !d.properties.some((p) => p.setter?.id == a.id))
  }
  return undefined
})

async function toggleOfflineNotificationsSubscription() {
  const isSubscribed = isSubscribedForOfflineNotifications.value
  if (isSubscribed != undefined) {
    loadingOverlay.startLoading()
    try {
      if (isSubscribed) {
        await notificationsApi.unsubscribeForDeviceOfflineNotifications(deviceId, userInfo.token)
      } else {
        await notificationsApi.subscribeForDeviceOfflineNotifications(deviceId, userInfo.token)
      }
      isSubscribedForOfflineNotifications.value = !isSubscribed
    } finally {
      loadingOverlay.stopLoading()
    }
  }
}
function executeAction(actionId: DeviceActionId) {
  // TODO
}
onMounted(async () => {
  device.value = await api.findDevice(deviceId, userInfo.token)
})
onMounted(async () => {
  isSubscribedForOfflineNotifications.value =
    await notificationsApi.isSubscribedForDeviceOfflineNotifications(deviceId, userInfo.token)
})
</script>

<template>
  <div class="navbar flex justify-between">
    <h1 class="text-2xl" :class="{ 'skeleton h-4 w-1/2': !device }">{{ device?.name }}</h1>
    <button
      v-if="isSubscribedForOfflineNotifications != undefined"
      class="btn btn-ghost btn-circle fa-solid"
      :class="{
        'fa-bell': isSubscribedForOfflineNotifications,
        'fa-bell-slash': !isSubscribedForOfflineNotifications,
      }"
      @click="toggleOfflineNotificationsSubscription"
      :title="`You are ${isSubscribedForOfflineNotifications ? '' : 'not '}subscribed for notifications about the device going offline`"
    ></button>
    <div v-else class="skeleton h-10 w-10 rounded-full"></div>
  </div>
  <ul v-if="device" class="list">
    <li v-for="p in device.properties" v-bind:key="p.id" class="list-row items-center">
      <span class="list-col-grow"> {{ p.name }} </span>
      <span> {{ p.value }} </span>
    </li>
    <li v-for="a in actionsToShow" v-bind:key="a.id" class="list-row items-center">
      <span class="list-col-grow"> {{ a.name }} </span>
      <button class="btn btn-ghost fa-solid fa-play" @click="executeAction(a.id)"></button>
    </li>
  </ul>
  <ul v-else class="list">
    <li v-for="i in [...Array(5).keys()]" v-bind:key="i" class="list-row items-center">
      <div class="skeleton h-5 w-1/3 list-col-grow"></div>
      <div class="skeleton h-5 w-18"></div>
    </li>
  </ul>
</template>

<style></style>
