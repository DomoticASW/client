<script setup lang="ts">
  import { formatDate, formatDuration, trigger } from '@/components/tasks-automations/example';
  defineProps({
    edit: Boolean
  })
</script>

<template>
  <!-- Change check to see just if the trigger exists or not, because the trigger could be removed while editing -->
  <div class="card card-sm bg-secondary/70 text-secondary-content my-2" v-if="$route.params.id !== undefined">
    <div class="card-body text-base grid grid-cols-2 px-4">
      <p>Start</p>
      <p class="font-bold justify-self-center truncate">{{ formatDate(trigger.start) }}</p>

      <p>Repeat every</p>
      <p class="justify-self-center truncate">{{ formatDuration(trigger.periodSeconds) }} </p>
      <template v-if="edit">
        <button class="btn btn-square fa-solid fa-xmark row-start-1 col-start-3 row-span-2 place-self-center"></button>
      </template>
    </div>
  </div>
</template>
