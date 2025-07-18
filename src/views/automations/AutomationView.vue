<script setup lang="ts">
  import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
  import { instructions } from '@/components/tasks-automations/example';
  const trigger = {
    start: new Date(),
    periodSeconds: 7202
  }

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const aa = String(date.getFullYear()).slice(-2); // Get last two digits of year
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${dd}/${mm}/${aa} ${hh}:${min}`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  }

  return parts.join(' ');
}

</script>

<template>
  <h1 class="text-xl">Trigger</h1>
  <div class="card card-sm bg-neutral text-neutral-content my-2">
    <div class="card-body text-sm grid grid-cols-2 px-4">
      <p>Start</p>
      <p class="font-bold justify-self-center truncate">{{ formatDate(trigger.start) }}</p>

      <p>Repeat every</p>
      <p class="justify-self-center truncate">{{ formatDuration(trigger.periodSeconds) }} </p>
    </div>
  </div>
  <hr class="m-4">
  <h1 class="text-xl">Actions</h1>
  <InstructionItem
    v-for="[key, instruction] in instructions.entries()"
    :key="key"
    :instruction="instruction"
  />
  <div class="pb-4"></div>
</template>

