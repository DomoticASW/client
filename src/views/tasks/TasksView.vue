<script setup lang="ts">
  const tasks = [
    "Relaxing lights",
    "Start Roomba",
    "Close windows",
    "Play music (Emma's room)"
  ]
</script>

<template>
  <ul class="list rounded-box">
    <li class="list-row" v-for="task in tasks" :key="task">
      <div class="list-col-grow flex items-center">
        <div>{{ task }}</div>
      </div>
      <button class="btn btn-circle btn-ghost" type="button" :aria-label="'Start task: ' + task">
        <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 3L20 12 6 21 6 3z"></path>
          </g>
        </svg>
      </button>
    </li>
  </ul>

  <div class="flex justify-end px-4 pb-4 items-end">
    <button class="btn btn-circle btn-outline" type="button" aria-label="Create new task">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-[1.2em]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<style></style>
