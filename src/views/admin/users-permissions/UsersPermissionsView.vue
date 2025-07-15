<script setup lang="ts">
import router from '@/router'

const users = ['Mia', 'Alex', 'Emma']

function goToPermissions(user: string) {
  router.push(`./users-permissions/${user}`)
}
</script>

<template>
  <ul class="list rounded-box">
    <li class="list-row" v-for="user in users" :key="user">
      <div class="list-col-grow flex items-center">
        {{ user }}
      </div>
      <button
        class="btn btn-circle btn-ghost"
        type="button"
        :aria-label="'Get permissions of: ' + user"
        @click="goToPermissions(user)"
      >
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
</template>

<style></style>
