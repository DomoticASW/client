<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import {
  DeviceId,
  type Device,
  type DeviceAction,
  type DeviceProperty,
} from '@/model/devices-management/Device'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { useUserInfoStore } from '@/stores/user-info'
import * as api from '@/api/devices-management/requests/devices'
import * as notificationsApi from '@/api/notifications-management/requests'
import { Type } from '@/model/Type'
import ValueIOControl from '@/components/devices/ValueIOControl.vue'
import { io } from 'socket.io-client'
const props = defineProps({ id: { type: String, required: true } })
const deviceId = DeviceId(props.id)
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const actionInputModal = useTemplateRef('action-input-modal')

const device = ref<Device | undefined>(undefined)
const executingAction = ref<DeviceAction<unknown> | undefined>(undefined)
const executingActionInput = ref<unknown | undefined>(undefined)
const isExecutingActionInputValid = ref<boolean | undefined>(undefined)

const actionsToShow = computed<DeviceAction<unknown>[] | undefined>(() => {
  const d = device.value
  if (d) {
    return d.actions.filter((a) => !d.properties.some((p) => p.setter?.id == a.id))
  }
  return undefined
})

async function onPropertyInput(property: DeviceProperty<unknown>, value: unknown) {
  if (property.setter) {
    await executeAction(property.setter, value)
  }
}

async function onAskActionInput(action: DeviceAction<unknown>) {
  executingAction.value = action
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
async function onCancelExecuteAction() {
  actionInputModal.value!.close()
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

/* Managing the device offline notifications subscription */
const offlineNotificationsModal = useTemplateRef('offline-notifications-modal')
const isSubscribedForOfflineNotifications = ref<boolean | undefined>(undefined)
onMounted(async () => {
  isSubscribedForOfflineNotifications.value =
    await notificationsApi.isSubscribedForDeviceOfflineNotifications(deviceId, userInfo.token)
})
async function subscribeForOfflineNotifications(activate: boolean) {
  if (activate === isSubscribedForOfflineNotifications.value) return

  loadingOverlay.startLoading()
  try {
    if (activate) {
      await notificationsApi.subscribeForDeviceOfflineNotifications(deviceId, userInfo.token)
    } else {
      await notificationsApi.unsubscribeForDeviceOfflineNotifications(deviceId, userInfo.token)
    }
    isSubscribedForOfflineNotifications.value = activate
  } finally {
    loadingOverlay.stopLoading()
  }
}

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
      @click="offlineNotificationsModal?.showModal()"
      :title="`You are ${isSubscribedForOfflineNotifications ? '' : 'not '}subscribed for notifications about the device going offline`"
    ></button>
    <div v-else class="skeleton h-10 w-10 rounded-full"></div>
  </div>
  <ul v-if="device" class="list">
    <li v-for="p in device.properties" v-bind:key="p.id" class="list-row items-center">
      <span class="list-col-grow"> {{ p.name }} </span>
      <ValueIOControl
        :typeConstraints="p.typeConstraints"
        :isInput="p.setter !== undefined"
        v-model="p.value"
        @input="(input) => onPropertyInput(p, input)"
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

  <!-- Dialog for offline notifications subscription -->
  <dialog ref="offline-notifications-modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Device offline notifications</h3>
      <p>Do you want to receive a notification when this device goes offline?</p>
      <form method="dialog">
        <div class="modal-action">
          <button class="btn btn-primary" v-on:click="subscribeForOfflineNotifications(true)">
            Yes
          </button>
          <button class="btn btn-primary" v-on:click="subscribeForOfflineNotifications(false)">
            No
          </button>
        </div>
      </form>
    </div>
  </dialog>

  <!-- Dialog for action input -->
  <dialog ref="action-input-modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Action input</h3>
      <ValueIOControl
        v-if="executingAction"
        :typeConstraints="executingAction!.inputTypeConstraints"
        :isInput="true"
        v-model="executingActionInput"
        v-model:isInputValid="isExecutingActionInputValid"
      />
      <div class="modal-action">
        <button
          class="btn btn-primary"
          v-on:click="onExecuteAction"
          :disabled="!isExecutingActionInputValid"
        >
          Execute
        </button>
        <button class="btn btn-primary btn-soft" v-on:click="onCancelExecuteAction">Cancel</button>
      </div>
    </div>
  </dialog>
</template>

<style></style>
