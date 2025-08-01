<script setup lang="ts">
import { type Trigger, type PeriodTrigger } from '@/model/scripts/Script'
import { ref, watch } from 'vue'
import {
  convertToSeconds,
  decomposeToLargestUnit,
  formatDateForDatetimeLocalInput,
  formatDate,
  formatDuration,
} from './timeUtils'

const props = defineProps<{
  trigger?: Trigger
  edit: boolean
}>()

const trigger = ref<Trigger | undefined>(props.trigger)
const timeUnit = ref<'seconds' | 'minutes' | 'hours' | 'days'>()
const time = ref<number>()
const dateTime = ref<string>()

watch(
  () => props.trigger,
  (val) => {
    trigger.value = val
  },
  { immediate: true },
)

watch(
  () => time.value,
  (val) => {
    if (val && timeUnit.value) {
      updateSeconds(val, timeUnit.value!)
    }
  },
)

watch(
  () => timeUnit.value,
  (val) => {
    if (val && time.value) {
      updateSeconds(time.value, val)
    }
  },
)

watch(
  () => dateTime.value,
  (val) => {
    if (val) {
      ;(props.trigger as PeriodTrigger).start = new Date(val)
    }
  },
)

function updateSeconds(first: number, second: 'seconds' | 'minutes' | 'hours' | 'days') {
  ;(props.trigger as PeriodTrigger).periodSeconds = convertToSeconds(first, second)
}

setTimeout(() => {
  updateValues()
}, 100)

function removeTrigger() {
  trigger.value = undefined
}

function addEmptyPeriodTrigger() {
  trigger.value = {
    start: new Date(),
    periodSeconds: 1,
  }
  updateValues()
}

function updateValues() {
  if (trigger.value && 'start' in trigger.value) {
    timeUnit.value = decomposeToLargestUnit(trigger.value.periodSeconds).unit
    time.value = decomposeToLargestUnit(trigger.value.periodSeconds).value
    dateTime.value = formatDateForDatetimeLocalInput(trigger.value.start)
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
    <div class="card-body text-base grid grid-cols-6 px-4" v-if="'start' in trigger">
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
