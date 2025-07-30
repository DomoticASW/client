<script setup lang="ts">
import { getAllDeviceGroups } from '@/api/devices-management/requests/device-groups'
import { getAllDevices } from '@/api/devices-management/requests/devices'
import type { Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import { type Instruction, InstructionType } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import {
  EmptyIfElseInstruction,
  EmptyIfInstruction,
  EmptySendNotification,
  EmptyStartTaskInstruction,
  EmptyWaitInstruction,
  EmtpyConstantInstruction,
} from './emptyInstructions'
import { Type } from '@/model/Type'

const props = defineProps<{
  instructions: Instruction[]
}>()

const userInfo = useUserInfoStore()
const groups = ref<DeviceGroup[]>()
const devices = ref<Device[]>()
const selectedGroup = ref<DeviceGroup | undefined>(undefined)

onMounted(async () => {
  groups.value = await getAllDeviceGroups(userInfo.token)
  devices.value = await getAllDevices(userInfo.token)
})

function addIfInstruction(instructions: Instruction[]) {
  instructions.push({
    type: InstructionType.IfInstruction,
    instruction: EmptyIfInstruction(),
  })
}

function addIfElseInstruction(instructions: Instruction[]) {
  instructions.push({
    type: InstructionType.IfElseInstruction,
    instruction: EmptyIfElseInstruction(),
  })
}

function addWaitInstruction(instructions: Instruction[]) {
  instructions.push({
    type: InstructionType.WaitInstruction,
    instruction: EmptyWaitInstruction(),
  })
}

function addStartTaskInstruction(instructions: Instruction[]) {
  instructions.push({
    type: InstructionType.StartTaskInstruction,
    instruction: EmptyStartTaskInstruction(),
  })
}

function addConstantInstruction(instructions: Instruction[]) {
  instructions.push({
    type: InstructionType.CreateConstantInstruction,
    instruction: EmtpyConstantInstruction(),
  })
}

function addSendNotification(instructions: Instruction[]) {
  instructions.push({
    type: InstructionType.SendNotificationInstruction,
    instruction: EmptySendNotification(),
  })
}

function addDevicePropertyConstantInstruction(instructions: Instruction[], device: Device) {
  instructions.push({
    type: InstructionType.CreateDevicePropertyConstantInstruction,
    instruction: {
      deviceId: device.id,
      devicePropertyId: '', // get random property from device
      name: '',
      type: Type.IntType, // Type get from device property
    },
  })
}
</script>

<template>
  <div class="grid grid-cols-3">
    <h3 class="text-xl col-span-3">Devices</h3>
    <select v-model="selectedGroup" class="select my-2 col-span-3 text-lg">
      <option selected :value="undefined">All devices</option>
      <option v-for="group in groups" :key="group.id" :value="group">{{ group.name }}</option>
    </select>

    <button
      type="button"
      v-for="device in selectedGroup ? selectedGroup.devices : devices"
      :key="device.id"
      class="btn justify-start my-1 sm:col-span-2 col-span-3 ml-4"
      @click="addDevicePropertyConstantInstruction(props.instructions, device)"
    >
      {{ device.name }}
    </button>
  </div>
  <div class="grid grid-cols-3">
    <h3 class="text-xl col-span-3 mb-2 mt-1">Control flow</h3>
    <button
      type="button"
      class="btn justify-start my-1 sm:col-span-2 col-span-3"
      @click="addIfInstruction(props.instructions)"
    >
      If
    </button>
    <button
      type="button"
      class="btn justify-start my-1 sm:col-span-2 col-span-3"
      @click="addIfElseInstruction(props.instructions)"
    >
      If-Else
    </button>
  </div>
  <div class="grid grid-cols-3">
    <h3 class="text-xl col-span-3 mb-2 mt-1">Others</h3>
    <button
      type="button"
      class="btn justify-start sm:col-span-2 col-span-3 my-1"
      @click="addWaitInstruction(props.instructions)"
    >
      Wait
    </button>
    <button
      type="button"
      class="btn justify-start sm:col-span-2 col-span-3 my-1"
      @click="addStartTaskInstruction(props.instructions)"
    >
      Start task
    </button>
    <button
      type="button"
      class="btn justify-start sm:col-span-2 col-span-3 my-1"
      @click="addConstantInstruction(props.instructions)"
    >
      Constant
    </button>
    <button
      type="button"
      class="btn justify-start sm:col-span-2 col-span-3 my-1"
      @click="addSendNotification(props.instructions)"
    >
      Send notification
    </button>
  </div>
</template>
