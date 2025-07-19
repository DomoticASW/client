<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'

const tasks = ref([
  { id: '1', name: 'Relaxing lights' },
  { id: '2', name: 'Start Roomba' },
  { id: '3', name: 'Close windows' },
  { id: '4', name: "Play music (Emma's room)" },
])
</script>

<template>
  <ul class="list rounded-box">
    <RouterLink
      v-for="task in tasks"
      :key="task.id"
      :to="{ name: 'task', params: { id: task.id } }"
    >
      <li class="list-row">
        <div class="list-col-grow flex items-center">
          {{ task.name }}
        </div>
        <a
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-play fa-lg !flex"
          :aria-label="'Start task: ' + task"
        ></a>
      </li>
    </RouterLink>
  </ul>

  <AddButton name="add-task">ss</AddButton>
</template>

<style></style>
