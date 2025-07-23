<script setup lang="ts">
import { formatDuration, formatDate, type Trigger } from '@/model/scripts/Script'
import { ref, watch } from 'vue'

const props = defineProps<{
  trigger?: Trigger
  edit: boolean
}>()

const trigger = ref<Trigger | undefined>(props.trigger)

watch(
  () => props.trigger,
  (val) => {
    trigger.value = val
  },
  { immediate: true },
)

function removeTrigger() {
  trigger.value = undefined
}
</script>

<template>
  <div class="grid grid-cols-2 p-4 justify-items-center" v-if="trigger === undefined">
    <button class="btn btn-neutral w-50" type="button">Device Event</button>
    <button class="btn btn-neutral w-50" type="button">Period</button>
  </div>
  <div class="card card-sm bg-secondary/70 text-secondary-content my-2" v-else>
    <div class="card-body text-base grid grid-cols-2 px-4" v-if="'start' in trigger">
      <p>Start</p>
      <p class="font-bold justify-self-center truncate">{{ formatDate(trigger.start) }}</p>

      <p>Repeat every</p>
      <p class="font-bold justify-self-center truncate">
        {{ formatDuration(trigger.periodSeconds) }}
      </p>
      <template v-if="edit">
        <button
          class="btn btn-square fa-solid fa-xmark row-start-1 col-start-3 row-span-2 place-self-center"
          @click="removeTrigger()"
        ></button>
      </template>
    </div>
  </div>
</template>
