<script lang="ts" setup>
import type { Device } from '@/model/devices-management/Device'
import {
  Color,
  Enum,
  IntRange,
  DoubleRange,
  type TypeConstraints,
} from '@/model/devices-management/Types'
import { InstructionType } from '@/model/scripts/Instruction'
import { Type } from '@/model/Type'
import { useInstructionsStore } from '@/stores/instructions'
import { ref } from 'vue'

const props = defineProps<{
  selectedDevice?: Device
  closeDialog: () => void
}>()

const instructionsStore = useInstructionsStore()
const isActionSelected = ref(false)

async function addDevicePropertyConstantInstruction(device: Device) {
  instructionsStore.instructions.push({
    type: InstructionType.CreateDevicePropertyConstantInstruction,
    instruction: {
      deviceId: device.id,
      devicePropertyId: device.properties[0].id,
      name: '',
      type: device.properties[0].typeConstraints.type,
    },
  })
}

async function addDeviceActionInstruction(device: Device) {
  instructionsStore.instructions.push({
    type: InstructionType.DeviceActionInstruction,
    instruction: {
      deviceId: device.id,
      deviceActionId: device.actions[0].id,
      input: getDefaultInput(device.actions[0].inputTypeConstraints),
    },
  })
}

function getDefaultInput<T>(type: TypeConstraints<T>) {
  if (type.__brand === 'IntRange') {
    return (type as IntRange).min
  }

  if (type.__brand === 'DoubleRange') {
    return (type as DoubleRange).min
  }

  if (type.__brand === 'Enum') {
    return (type as Enum).values.values().next().value
  }

  switch (type.type) {
    case Type.BooleanType:
      return false
    case Type.ColorType:
      return Color(0, 0, 0)
    case Type.VoidType:
      return undefined
    case Type.IntType:
    case Type.DoubleType:
      return 0
    case Type.StringType:
      return ''
  }
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
        Do you want to use a property or an action?
      </p>
      <p v-else-if="selectedDevice.actions.length != 0">This device has only actions</p>
      <p v-else-if="selectedDevice.properties.length != 0">This device has only properties</p>
      <p v-else>This device does not have any properties or actions</p>
      <form @submit.prevent="handleConfirm">
        <div class="modal-action grid grid-cols-3 w-full">
          <button type="button" class="btn btn-error col-start-1" @click="closeDialog">
            Close
          </button>
          <button
            type="submit"
            class="btn"
            :class="selectedDevice.actions.length == 0 ? 'col-start-3' : ''"
            @click="isActionSelected = false"
            v-if="selectedDevice.properties.length != 0"
          >
            <template v-if="selectedDevice.actions.length != 0"> Property </template>
            <template v-else>Confirm</template>
          </button>
          <button
            type="submit"
            class="btn"
            :class="selectedDevice.actions.length == 0 ? 'col-start-3' : ''"
            @click="isActionSelected = true"
            v-if="selectedDevice.actions.length != 0"
          >
            <template v-if="selectedDevice.properties.length != 0"> Action </template>
            <template v-else>Confirm</template>
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
