<script setup lang="ts">
import { type Device } from '@/model/devices-management/Device'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
import { InstructionType } from '@/model/scripts/Instruction'
import { onMounted, ref, useTemplateRef } from 'vue'
import AddButton from '../AddButton.vue'
import {
  EmptyIfElseInstruction,
  EmptyIfInstruction,
  EmptySendNotification,
  EmptyStartTaskInstruction,
  EmptyWaitInstruction,
  EmptyConstantInstruction,
} from './emptyInstructions'
import { useInstructionsStore } from '@/stores/instructions'
import { useGroupsStore } from '@/stores/groups'
import { useDevicesStore } from '@/stores/devices'

const instructionsStore = useInstructionsStore()

const modal = useTemplateRef('add-instruction-modal')
const groups = ref<DeviceGroup[]>()
const devices = ref<Device[]>()
const selectedGroup = ref<DeviceGroup | undefined>(undefined)

defineProps<{
  openDialog: (device: Device) => void
  closeDialog: () => void
}>()

onMounted(() => {
  groups.value = useGroupsStore().groups
  devices.value = useDevicesStore().devices
})

function addIfInstruction() {
  instructionsStore.instructions.push({
    type: InstructionType.IfInstruction,
    instruction: EmptyIfInstruction(),
  })
}

function addIfElseInstruction() {
  instructionsStore.instructions.push({
    type: InstructionType.IfElseInstruction,
    instruction: EmptyIfElseInstruction(),
  })
}

function addWaitInstruction() {
  instructionsStore.instructions.push({
    type: InstructionType.WaitInstruction,
    instruction: EmptyWaitInstruction(),
  })
}

function addStartTaskInstruction() {
  instructionsStore.instructions.push({
    type: InstructionType.StartTaskInstruction,
    instruction: EmptyStartTaskInstruction(),
  })
}

function addConstantInstruction() {
  instructionsStore.instructions.push({
    type: InstructionType.CreateConstantInstruction,
    instruction: EmptyConstantInstruction(),
  })
}

function addSendNotification() {
  instructionsStore.instructions.push({
    type: InstructionType.SendNotificationInstruction,
    instruction: EmptySendNotification(),
  })
}
</script>

<template>
  <AddButton @onclick="modal?.showModal()" />
  <dialog ref="add-instruction-modal" class="modal modal-end">
    <div class="modal-box sm:w-4/12 w-7/12 max-w-screen">
      <div class="grid grid-cols-3">
        <h3 class="text-xl col-span-3 mb-2 mt-1">
          Control flow instructions
          <button
            class="fa-circle-info fa-solid fa-sm btn btn-ghost btn-xs btn-circle"
            onclick="flow_info.showModal()"
          ></button>
        </h3>
        <button
          type="button"
          class="btn justify-start my-1 sm:col-span-2 col-span-3"
          @click="addIfInstruction()"
        >
          If
        </button>
        <button
          type="button"
          class="btn justify-start my-1 sm:col-span-2 col-span-3"
          @click="addIfElseInstruction()"
        >
          If-Else
        </button>
      </div>
      <div class="grid grid-cols-3">
        <h3 class="text-xl col-span-3 mb-2 mt-1">
          Operation instructions
          <button
            class="fa-circle-info fa-solid fa-sm btn btn-ghost btn-xs btn-circle"
            onclick="operations_info.showModal()"
          ></button>
        </h3>
        <button
          type="button"
          class="btn justify-start sm:col-span-2 col-span-3 my-1"
          @click="addConstantInstruction()"
        >
          Create constant
        </button>
        <button
          type="button"
          class="btn justify-start sm:col-span-2 col-span-3 my-1"
          @click="addWaitInstruction()"
        >
          Wait
        </button>
        <button
          type="button"
          class="btn justify-start sm:col-span-2 col-span-3 my-1"
          @click="addStartTaskInstruction()"
        >
          Start task
        </button>
        <button
          type="button"
          class="btn justify-start sm:col-span-2 col-span-3 my-1"
          @click="addSendNotification()"
        >
          Send notification
        </button>
      </div>
      <div class="grid grid-cols-3">
        <h3 class="text-xl col-span-3">
          Devices instructions
          <button
            class="fa-circle-info fa-solid fa-sm btn btn-ghost btn-xs btn-circle"
            onclick="devices_info.showModal()"
          ></button>
        </h3>
        <select v-model="selectedGroup" class="select my-2 col-span-3 text-lg">
          <option selected :value="undefined">All devices</option>
          <option v-for="group in groups" :key="group.id" :value="group">{{ group.name }}</option>
        </select>

        <button
          type="button"
          v-for="device in selectedGroup ? selectedGroup.devices : devices"
          :key="device.id"
          class="btn justify-start my-1 sm:col-span-2 col-span-3 ml-4"
          @click="openDialog(device)"
        >
          {{ device.name }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button></button>
    </form>
  </dialog>
</template>
