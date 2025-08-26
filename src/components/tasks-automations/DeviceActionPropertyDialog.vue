<script lang="ts" setup>
import type { Device } from '@/model/devices-management/Device'
import { InstructionType } from '@/model/scripts/Instruction'
import { useInstructionsStore } from '@/stores/instructions'
import { ref } from 'vue'
import {
  defaultDeviceActionInstruction,
  defaultDevicePropertyConstantInstruction,
} from './emptyInstructions'

const props = defineProps<{
  selectedDevice?: Device
  closeDialog: () => void
}>()

const instructionsStore = useInstructionsStore()
const isActionSelected = ref(false)

function addDevicePropertyConstantInstruction(device: Device) {
  instructionsStore.instructions.push({
    type: InstructionType.CreateDevicePropertyConstantInstruction,
    instruction: defaultDevicePropertyConstantInstruction(device),
  })
}

function addDeviceActionInstruction(device: Device) {
  instructionsStore.instructions.push({
    type: InstructionType.DeviceActionInstruction,
    instruction: defaultDeviceActionInstruction(device),
  })
}

function handleConfirm() {
  if (props.selectedDevice) {
    if (isActionSelected.value) {
      addDeviceActionInstruction(props.selectedDevice)
    } else {
      addDevicePropertyConstantInstruction(props.selectedDevice)
    }
  }
  props.closeDialog()
}
</script>

<template>
  <dialog id="device_action_property" class="modal modal-middle">
    <div class="modal-box max-w-sm" v-if="selectedDevice">
      <h3 class="card-title mb-2 mx-auto justify-center">{{ selectedDevice.name }}</h3>
      <p>{{ selectedDevice.name }} has been selected.</p>
      <p v-if="selectedDevice.actions.length != 0 && selectedDevice.properties.length != 0">
        Do you want to create a constant linked to a property or an instruction to execute an
        action?
      </p>
      <p v-else-if="selectedDevice.actions.length != 0">
        This device has only actions, so it is only possible to create instructions to execute an
        action.
      </p>
      <p v-else-if="selectedDevice.properties.length != 0">
        his device has only properties, so it is only possible to create constants linked to
        properties.
      </p>
      <p v-else>This device does not have any properties or actions.</p>
      <form @submit.prevent="handleConfirm">
        <div class="modal-action w-full">
          <button
            type="submit"
            class="btn btn-primary"
            @click="isActionSelected = false"
            v-if="selectedDevice.properties.length != 0"
          >
            <template v-if="selectedDevice.actions.length != 0"> Link to a property </template>
            <template v-else>Confirm</template>
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            @click="isActionSelected = true"
            v-if="selectedDevice.actions.length != 0"
          >
            <template v-if="selectedDevice.properties.length != 0"> Execute an action </template>
            <template v-else>Confirm</template>
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeDialog">close</button>
    </form>
  </dialog>
</template>
