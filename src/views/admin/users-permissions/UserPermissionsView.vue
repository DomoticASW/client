<script setup lang="ts">
const devicesWithPermissions = ['Videocamera', 'Door']
const devicesWithoutPermissions = ['Thermometer', 'Lamp']

function addUserDevicePermissions(deviceId: string) {
  // TODO: Implement the logic to add permissions for the device
  console.log(`Adding permissions for device: ${deviceId}`)
}

function removeUserDevicePermissions(deviceId: string) {
  // TODO: Implement the logic to remove permissions for the device
  console.log(`Removing permissions for device: ${deviceId}`)
}
</script>

<template>
  <div>
    <div>
      <h1 class="text-2xl font-bold dark:text-white">Can use these devices</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="device in devicesWithPermissions" :key="device">
            <div class="list-col-grow flex items-center">
              {{ device }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Remove permission on: ' + device"
              @click="removeUserDevicePermissions(device)"
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
      <h1 class="text-2xl font-bold dark:text-white">Cannot use these devices</h1>
      <div>
        <ul class="list rounded-box">
          <li class="list-row" v-for="device in devicesWithoutPermissions" :key="device">
            <div class="list-col-grow flex items-center">
              {{ device }}
            </div>
            <button
              class="btn btn-circle btn-ghost"
              type="button"
              :aria-label="'Add permission of: ' + device"
              @click="addUserDevicePermissions(device)"
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
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
