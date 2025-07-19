<script setup lang="ts">
  import { formatDate, formatDuration, trigger } from '@/components/tasks-automations/example';
</script>

<template>
  <div class="card card-sm bg-secondary/70 text-secondary-content my-2" v-if="$route.params.id !== undefined">
    <div class="card-body text-base grid grid-cols-2 px-4">
      <p>Start</p>
      <p class="font-bold justify-self-center truncate">{{ formatDate(trigger.start) }}</p>

      <p>Repeat every</p>
      <p class="justify-self-center truncate">{{ formatDuration(trigger.periodSeconds) }} </p>
    </div>
  </div>
</template>
