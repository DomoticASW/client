<script setup lang="ts">
import { formatDate, formatDuration, trigger } from '@/components/tasks-automations/example'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
defineProps({
  edit: Boolean,
})

const triggerIsPresent = ref(useRoute().params.id !== undefined)

function removeTrigger() {
  triggerIsPresent.value = false
}
</script>

<template>
  <div class="grid grid-cols-2 p-4 justify-items-center" v-if="!triggerIsPresent">
    <button class="btn btn-neutral w-50" type="button">Device Event</button>
    <button class="btn btn-neutral w-50" type="button">Period</button>
  </div>
  <div class="card card-sm bg-secondary/70 text-secondary-content my-2" v-if="triggerIsPresent">
    <div class="card-body text-base grid grid-cols-2 px-4">
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
