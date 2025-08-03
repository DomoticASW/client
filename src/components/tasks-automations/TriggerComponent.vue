<script setup lang="ts">
import { isPeriodTrigger, type Trigger } from '@/model/scripts/Script'
import { computed } from 'vue'
import {
  convertToSeconds,
  decomposeToLargestUnit,
  formatDate,
  formatDateForDatetimeLocalInput,
  formatDuration,
} from './timeUtils'

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
</script>

<template>
  <div class="grid grid-cols-2 p-4 justify-items-center" v-if="trigger === undefined">
    <button class="btn btn-neutral sm:w-50 w-25" type="button">Device Event</button>
    <button @click="addEmptyPeriodTrigger()" class="btn btn-neutral sm:w-50 w-25" type="button">
      Period
    </button>
  </div>
  <div class="card card-sm bg-secondary/70 text-secondary-content my-2" v-else>
    <div class="card-body text-base grid grid-cols-6 px-4" v-if="isPeriodTrigger(trigger)">
      <p class="col-span-2">Start</p>
      <p v-if="!edit" class="font-bold justify-self-center truncate col-span-4">
        {{ formatDate(trigger.start) }}
      </p>
      <div v-if="edit" class="justify-self-center col-span-4">
        <input
          type="datetime-local"
          v-model="dateTime"
          class="input h-7 text-base-content text-center"
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
          class="input h-7 max-w-15 p-2 text-base-content text-center"
        />
        <select v-model="timeUnit" class="select h-7 w-25 text-base-content text-center">
          <option selected disabled>Time unit</option>
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
      <template v-if="edit">
        <button
          class="btn btn-square fa-solid fa-xmark row-start-1 col-start-7 row-span-2 place-self-center"
          @click="removeTrigger()"
        ></button>
      </template>
    </div>
  </div>
</template>
