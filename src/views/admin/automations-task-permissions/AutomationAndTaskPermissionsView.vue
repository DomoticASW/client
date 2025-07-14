<script setup lang="ts">
import { reactive, ref } from 'vue'

const whitelist = ['Liam']
const blacklist = ['Bob']
const editlist = ['Liam']
const burger = ['Whitelist', 'Blacklist', 'Editlist']
const listSelected = reactive({ name: 'Whitelist', items: whitelist })
const users = ['Alex', 'Mia']
const open = ref(false)

function addUser(user: string) {
  // TODO: Implement the logic to add the user
  console.log(`Adding user: ${user}`)
}

function removeUser(user: string) {
  // TODO: Implement the logic to add the user
  console.log(`Adding user: ${user}`)
}

function select(option: string) {
  open.value = false
  switch (option) {
    case 'Whitelist':
      listSelected.name = 'Whitelist'
      listSelected.items = whitelist
      break
    case 'Blacklist':
      listSelected.name = 'Blacklist'
      listSelected.items = blacklist
      break
    case 'Editlist':
      listSelected.name = 'Editlist'
      listSelected.items = editlist
      break
  }
}
</script>

<template>
  <div>
    <div class="relative">
      <div class="flex items-center space-x-2">
        <h1 class="text-2xl font-bold dark:text-white">{{ listSelected.name }}</h1>
        <button class="btn btn-circle btn-ghost" type="button" @click="open = !open">
          <svg
            class="size-[1.2em] transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M6 9l6 6 6-6"></path>
            </g>
          </svg>
        </button>
      </div>
      <transition
        name="slide"
        enter-active-class="transition duration-200 ease-out"
        leave-active-class="transition duration-150 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="open"
          class="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
        >
          <ul>
            <li
              @click="select(list)"
              class="list-row px-4 py-2 hover:bg-gray-100 cursor-pointer"
              v-for="list in burger"
              :key="list"
            >
              {{ list }}
            </li>
          </ul>
        </div>
      </transition>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in listSelected.items" :key="user">
            <div class="list-col-grow flex items-center">
              {{ user }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Get permissions of: ' + user"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  @click="removeUser(user)"
                >
                  <path d="M6 6l12 12M6 18L18 6"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <hr class="my-4 border-gray-300" />
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Users</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in users" :key="user">
            <div class="list-col-grow flex items-center">
              {{ user }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Get permissions of: ' + user"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  @click="addUser(user)"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
