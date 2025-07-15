<script setup lang="ts">
const registeredUsers = [
  { name: 'Alex', email: 'alex@email.com', role: 'admin' },
  { name: 'Mia', email: 'mia@email.com', role: 'user' },
]
const unregisteredUsers = [
  { name: 'Liam', email: 'liam@email.com' },
  { name: 'Emma', email: 'emma@email.com' },
]

function removeUser(userEmail: string) {
  // TODO: Implement the logic to remove the user
  console.log(`Removing user: ${userEmail}`)
}

function removeRequest(userEmail: string) {
  // TODO: Implement the logic to remove the request
  console.log(`Removing request: ${userEmail}`)
}

function addUser(userEmail: string) {
  // TODO: Implement the logic to add the user
  console.log(`Adding user: ${userEmail}`)
}
</script>

<template>
  <div>
    <div>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in registeredUsers" :key="user.email">
            <div class="list-col-grow flex flex-col">
              <div>{{ user.name }}</div>
              <small class="text-gray-400 ms-1">{{ user.email }}</small>
            </div>
            <small v-if="user.role === 'admin'" class="text-gray-400 flex items-center">{{
              user.role
            }}</small>
            <button
              v-else
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Remove: ' + user"
              @click="removeUser(user.email)"
            >
              <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 6l12 12M6 18L18 6"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <hr class="my-4 border-gray-300" />
      <h1 class="text-2xl dark:text-white text-center">Registration requests</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="user in unregisteredUsers" :key="user.email">
            <div class="list-col-grow flex flex-col">
              <div>{{ user.name }}</div>
              <small class="text-gray-400 ms-1">{{ user.email }}</small>
            </div>
            <div>
              <button
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Remove request of: ' + user"
                @click="removeRequest(user.email)"
              >
                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M6 6l12 12M6 18L18 6"></path>
                  </g>
                </svg>
              </button>
              <button
                class="btn btn-circle btn-ghost"
                type="button"
                :aria-label="'Accept request of: ' + user"
                @click="addUser(user.email)"
              >
                <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 5v14M5 12h14"></path>
                  </g>
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
