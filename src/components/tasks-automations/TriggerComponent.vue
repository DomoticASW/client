<script setup lang="ts">
import { isDeviceEventTrigger, isPeriodTrigger, type Trigger } from '@/model/scripts/Script'
import { computed, onMounted, ref, watch } from 'vue'
import {
  convertToSeconds,
  decomposeToLargestUnit,
  formatDate,
  formatDateForDatetimeLocalInput,
  formatDuration,
} from './timeUtils'
import type { Device } from '@/model/devices-management/Device'
import { findDevice, getAllDevices } from '@/api/devices-management/requests/devices'
import { useUserInfoStore } from '@/stores/user-info'

const props = defineProps<{
  trigger?: Trigger
  edit: boolean
}>()

const emit = defineEmits<{
  trigger: [value?: Trigger]
}>()

const trigger = computed({
  get: () => props.trigger,
  set: (newValue) => {
    emit('trigger', newValue)
  },
})

watch(
  () => props.trigger,
  async (val) => {
    if (isDeviceEventTrigger(val)) {
      selectedDevice.value = await findDevice(val.deviceId, userInfo.token)
      selectedEvent.value = val.eventName
    }
  },
)

const timeUnit = computed({
  get: () => {
    if (isPeriodTrigger(trigger.value)) {
      return decomposeToLargestUnit(trigger.value.periodSeconds).unit
    } else {
      return undefined
    }
  },
  set: (newValue) => {
    if (time.value && newValue) {
      updateSeconds(time.value, newValue)
    }
  },
})

const time = computed({
  get: () => {
    if (isPeriodTrigger(trigger.value)) {
      return decomposeToLargestUnit(trigger.value.periodSeconds).value
    } else {
      return undefined
    }
  },
  set: (newValue) => {
    if (newValue && timeUnit.value) {
      updateSeconds(newValue, timeUnit.value)
    }
  },
})

const dateTime = computed({
  get: () => {
    if (isPeriodTrigger(trigger.value)) {
      return formatDateForDatetimeLocalInput(trigger.value.start)
    } else {
      return undefined
    }
  },
  set: (newValue) => {
    if (newValue && isPeriodTrigger(trigger.value)) {
      trigger.value.start = new Date(newValue)
    }
  },
})

function updateSeconds(first: number, second: 'seconds' | 'minutes' | 'hours' | 'days') {
  if (isPeriodTrigger(trigger.value)) {
    trigger.value.periodSeconds = convertToSeconds(first, second)
  }
}

function removeTrigger() {
  trigger.value = undefined
}

function addEmptyPeriodTrigger() {
  trigger.value = {
    start: new Date(),
    periodSeconds: 1,
  }
}

const userInfo = useUserInfoStore()
const selectedDevice = ref<Device>()
const selectedEvent = ref<string>('')
const devices = ref<Device[]>()

watch(
  () => selectedDevice.value,
  (val) => {
    if (val && isDeviceEventTrigger(trigger.value) && val.events.length != 0) {
      trigger.value.deviceId = val.id
      trigger.value.eventName = val.events[0].name
    }
  },
)

watch(
  () => selectedEvent.value,
  (val) => {
    if (
      val &&
      isDeviceEventTrigger(trigger.value) &&
      selectedDevice.value?.events.map((e) => e.name).includes(val)
    ) {
      trigger.value.eventName = val
    }
  },
)

function openDeviceDialog() {
  const dialog = document.getElementById('device_dialog') as HTMLDialogElement
  dialog.showModal()
}

function handleConfirm() {
  if (selectedDevice.value && selectedDevice.value.events.length !== 0) {
    trigger.value = {
      deviceId: selectedDevice.value.id,
      eventName: selectedDevice.value.events[0].name,
    }
  } else {
    throw Error('A device is requested to be selected')
  }
  closeDialog()
}

function closeDialog() {
  const dialog = document.getElementById('device_dialog') as HTMLDialogElement
  dialog.close()
}

onMounted(async () => {
  devices.value = await getAllDevices(userInfo.token)
})
</script>

<template>
  <!-- Buttons to display when the trigger is not set -->
  <div class="grid grid-cols-2 p-4 justify-items-center" v-if="trigger === undefined">
    <button @click="openDeviceDialog()" class="btn btn-neutral sm:w-50 w-25" type="button">
      Device Event
    </button>
    <button @click="addEmptyPeriodTrigger()" class="btn btn-neutral sm:w-50 w-25" type="button">
      Period
    </button>
  </div>
  <!-- Trigger -->
  <div
    class="card card-sm bg-base-300 text-base-content border border-neutral shadow-lg my-2"
    v-else
  >
    <!-- Period trigger -->
    <div class="card-body text-base grid grid-cols-6 px-4">
      <template v-if="isPeriodTrigger(trigger)">
        <p class="col-span-2">Start</p>
        <p v-if="!edit" class="font-bold justify-self-center truncate col-span-4">
          {{ formatDate(trigger.start) }}
        </p>
        <div v-if="edit" class="justify-self-center col-span-4">
          <input
            type="datetime-local"
            v-model="dateTime"
            class="input h-7 input-primary text-center"
          />
        </div>

        <p class="col-span-2">Repeat every</p>
        <p v-if="!edit" class="font-bold justify-self-center truncate col-span-4">
          {{ formatDuration(trigger.periodSeconds) }}
        </p>
        <div v-else class="justify-self-center col-span-4">
          <input
            type="number"
            v-model="time"
            class="input h-7 max-w-15 p-2 mr-2 input-primary text-center"
          />
          <select v-model="timeUnit" class="select h-7 w-25 input-primary text-center">
            <option selected disabled>Time unit</option>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </template>
      <!-- Device Event trigger -->
      <template v-else-if="isDeviceEventTrigger(trigger) && selectedDevice">
        <p class="col-span-full font-bold text-center">{{ selectedDevice.name }}</p>
        <select
          v-model="selectedEvent"
          class="col-span-full select h-7 w-45 select-primary justify-self-center text-center"
          v-if="edit"
        >
          <option selected disabled>Pick an event</option>
          <option
            :value="event.name"
            v-for="event in selectedDevice.events"
            :key="event.name"
            :selected="selectedEvent == event.name"
          >
            {{ event.name }}
          </option>
        </select>
        <p class="col-span-full text-center" v-else>On: {{ trigger.eventName }}</p>
      </template>
      <template v-if="edit">
        <button
          class="btn btn-square btn-primary fa-solid fa-xmark row-start-1 col-start-7 row-span-2 place-self-center"
          @click="removeTrigger()"
        ></button>
      </template>
    </div>
  </div>
  <!-- Dialog to choose the device -->
  <dialog id="device_dialog" class="modal modal-middle">
    <div class="modal-box max-w-sm" v-if="devices">
      <label for="devices" class="fieldset-legend text-sm mx-3">Devices</label>
      <select v-model="selectedDevice" name="devices" id="devices" class="select mt-2 mx-2">
        <option :value="undefined" selected disabled>Pick a device</option>
        <template v-for="device in devices" :key="device.id">
          <option :value="device" v-if="device.events.length !== 0">
            {{ device.name }}
          </option>
        </template>
      </select>
      <form @submit.prevent="handleConfirm">
        <div class="modal-action w-full">
          <button type="submit" class="btn btn-primary">Confirm</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
</template>
