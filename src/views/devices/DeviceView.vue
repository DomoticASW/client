<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { DeviceId, type Device, type DeviceAction } from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import * as api from '@/api/devices-management/requests/devices'
import * as notificationsApi from '@/api/notifications-management/requests'
import { Type } from '@/model/Type'
import ValueIOControl from '@/components/devices/ValueIOControl.vue'
import { Color } from '@/model/devices-management/Types'
import { io } from 'socket.io-client'

const props = defineProps({ id: { type: String, required: true } })
const deviceId = DeviceId(props.id)
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const actionInputModal = useTemplateRef('action-input-modal')

const device = ref<Device | undefined>(undefined)
const isSubscribedForOfflineNotifications = ref<boolean | undefined>(undefined)
const executingAction = ref<DeviceAction<unknown> | undefined>(undefined)
const executingActionInput = ref<unknown | undefined>(undefined)

const actionsToShow = computed<DeviceAction<unknown>[] | undefined>(() => {
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
async function onAskActionInput(action: DeviceAction<unknown>) {
  executingAction.value = action
  switch (action.inputTypeConstraints.type) {
    case Type.IntType:
      executingActionInput.value = 0
      if (action.inputTypeConstraints.__brand === 'IntRange') {
        executingActionInput.value = action.inputTypeConstraints.min
      }
      break
    case Type.DoubleType:
      executingActionInput.value = 0
      if (action.inputTypeConstraints.__brand === 'DoubleRange') {
        executingActionInput.value = action.inputTypeConstraints.min
      }
      break
    case Type.BooleanType:
      executingActionInput.value = true
      break
    case Type.ColorType:
      executingActionInput.value = Color(0, 0, 0)
      break
    case Type.StringType:
      executingActionInput.value = ''
      if (action.inputTypeConstraints.__brand === 'Enum') {
        executingActionInput.value = Array.from(action.inputTypeConstraints.values)[0]
      }
      break
    case Type.VoidType:
      executingActionInput.value = undefined
      break
  }
  if (action.inputTypeConstraints.type != Type.VoidType) {
    actionInputModal.value!.showModal()
  } else {
    await onExecuteAction()
  }
}
async function onExecuteAction() {
  actionInputModal.value!.close()
  await executeAction(executingAction.value!, executingActionInput.value)
  executingAction.value = undefined
  executingActionInput.value = undefined
}
async function executeAction(action: DeviceAction<unknown>, input?: unknown) {
  loadingOverlay.startLoading()
  try {
    await api.executeAction(deviceId, action.id, input, userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
}
onMounted(async () => {
  device.value = await api.findDevice(deviceId, userInfo.token)
})
onMounted(async () => {
  isSubscribedForOfflineNotifications.value =
    await notificationsApi.isSubscribedForDeviceOfflineNotifications(deviceId, userInfo.token)
})

/* SocketIO subscription for real time property updates */
type PropertyUpdateDTO = { deviceId: string; propertyId: string; value: unknown }
const socket = io('/api/devices/property-updates')
  .on('connect', () => socket.emit('subscribe', { deviceId: deviceId }))
  .on('device-property-update', (data: PropertyUpdateDTO) => {
    if (data.deviceId == deviceId) {
      const property = device.value?.properties.find((p) => p.id == data.propertyId)
      if (property) {
        property.value = data.value
      }
    }
  })
onUnmounted(() => {
  socket.close()
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
      <ValueIOControl
        v-model="p.value"
        :typeConstraints="p.typeConstraints"
        :isInput="p.setter !== undefined"
      />
    </li>
    <li v-for="a in actionsToShow" v-bind:key="a.id" class="list-row items-center">
      <span class="list-col-grow"> {{ a.name }} </span>
      <button class="btn btn-ghost fa-solid fa-play" @click="onAskActionInput(a)"></button>
    </li>
  </ul>
  <ul v-else class="list">
    <li v-for="i in [...Array(5).keys()]" v-bind:key="i" class="list-row items-center">
      <div class="skeleton h-5 w-1/3 list-col-grow"></div>
      <div class="skeleton h-5 w-18"></div>
    </li>
  </ul>

  <!-- Dialog for action input -->
  <dialog ref="action-input-modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Action input</h3>
      <ValueIOControl
        v-if="executingAction"
        :typeConstraints="executingAction!.inputTypeConstraints"
        :isInput="true"
        v-model="executingActionInput"
      />
      <div class="modal-action">
        <button class="btn btn-primary" v-on:click="onExecuteAction">Execute</button>
        <button class="btn btn-primary btn-soft" v-on:click="actionInputModal!.close()">
          Cancel
        </button>
      </div>
    </div>
  </dialog>
</template>

<style></style>
