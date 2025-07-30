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
              class="btn btn-circle btn-ghost fa-solid fa-xmark"
              type="button"
              :aria-label="'Remove permission on: ' + device"
              @click="removeUserDevicePermissions(device)"
            >
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
              class="btn btn-circle btn-ghost fa-solid fa-plus"
              type="button"
              :aria-label="'Add permission of: ' + device"
              @click="addUserDevicePermissions(device)"
            >
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style></style>
