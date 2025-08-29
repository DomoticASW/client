<template>
  <InstructionLayout
    :colors="colors"
    :edit="edit"
    :instruction="props.instruction"
    @click="openDialog"
    v-if="device && action"
    :class="edit ? 'cursor-pointer transition-all duration-100 hover:bg-primary/10' : ''"
  >
    <DeviceNameAndGroup :id="id" :device="device" />

    <template v-if="action.inputTypeConstraints.type === Type.VoidType">
      <p class="font-bold text-center truncate">{{ action.name }}</p>
    </template>
    <template v-else>
      <p class="text-base font-bold truncate text-center">{{ action.name }}</p>
      <input
        class="col-start-2 place-self-center"
        v-if="action.inputTypeConstraints.type === Type.ColorType"
        type="color"
        :value="instruction.input"
        disabled
      />
      <p class="text-center truncate col-start-2" v-else>{{ instruction.input }}</p>
    </template>
  </InstructionLayout>

  <dialog :id="id" class="modal" v-if="device && action">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mx-2 mb-2">Device action</h3>
      <form @submit.prevent="handleConfirm">
        <!-- Selection of an action -->
        <label for="actions" class="fieldset-legend text-sm mx-3">{{ device.name }} actions</label>
        <select
          v-model="variableForm.deviceActionId"
          class="select mt-2 mx-2"
          name="actions"
          id="actions"
        >
          <option disabled>Pick an action</option>
          <option
            v-for="a in device.actions"
            :key="a.id"
            :selected="a.id == action.id"
            :value="a.id"
          >
            {{ a.name }}
          </option>
        </select>
        <!-- Change of the action input -->
        <label
          for="input"
          class="fieldset-legend text-sm mx-3"
          v-if="variableType().type !== 'null'"
          >Input</label
        >
        <template v-if="variableType().type === 'range'">
          <div class="flex justify-center px-2.5 mt-2 text-xs">
            {{ variableForm.input }}
          </div>
          <input
            :type="variableType().type"
            :class="['mt-2 mx-2', variableType().class]"
            step="1"
            :min="variableType().constraints.min"
            :max="variableType().constraints.max"
            v-model.number="variableForm.input"
            name="input"
            id="input"
          />
          <div class="flex justify-between px-2.5 mt-2 text-xs">
            <span>{{ variableType().constraints.min }}</span>
            <span>{{ variableType().constraints.max }}</span>
          </div>
        </template>

        <input
          v-else-if="variableType().type === 'number'"
          :type="variableType().type"
          :class="['mt-2 mx-2', variableType().class]"
          v-model.number="variableForm.input"
          :min="variableType().constraints.min"
          :max="variableType().constraints.max"
          :step="selectedAction?.inputTypeConstraints.type === Type.DoubleType ? 'any' : '1'"
          name="input"
          id="input"
        />

        <select
          v-else-if="variableType().type === 'select'"
          :class="['mt-2 mx-2', variableType().class]"
          v-model="variableForm.input"
          name="input"
          id="input"
        >
          <option
            v-for="value in variableType().constraints.values"
            :key="value"
            :value="value"
            :selected="value === variableForm.input"
          >
            {{ value }}
          </option>
        </select>

        <input
          v-else-if="variableType().type === 'checkbox'"
          :class="['mt-2 mx-2', variableType().class]"
          :type="variableType().type"
          v-model="variableForm.input"
          name="input"
          id="input"
        />

        <input
          v-else-if="variableType().type === 'color'"
          :class="['mt-2 mx-2', variableType().class]"
          :type="variableType().type"
          v-model="variableForm.input"
          name="input"
          id="input"
        />

        <input
          v-else-if="variableType().type === 'text'"
          :class="['mt-2 mx-2', variableType().class]"
          :type="variableType().type"
          v-model="variableForm.input"
          name="input"
          id="input"
        />
        <div class="modal-action w-full">
          <button type="submit" class="btn btn-primary">Confirm</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import {
  InstructionType,
  type DeviceActionInstruction,
  type Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import type { Device, DeviceAction } from '@/model/devices-management/Device'
import { useInstructionsStore } from '@/stores/instructions'
import { Type } from '@/model/Type'
import { getDefaultInput } from './emptyInstructions'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import DeviceNameAndGroup from '../DeviceNameAndGroup.vue'
import { useGroupsStore } from '@/stores/groups'
import { useDevicesStore } from '@/stores/devices'

const props = defineProps<{
  id: string
  instruction: Instruction
  colors: string
  edit: boolean
}>()

const instructionsStore = useInstructionsStore()
const loadingOverlay = useLoadingOverlayStore()
const instruction = ref(props.instruction.instruction as DeviceActionInstruction)
const device = ref<Device>()
const action = ref<DeviceAction<unknown>>()
const groupsStore = useGroupsStore()
const devicesStore = useDevicesStore()

const selectedAction = ref<DeviceAction<unknown>>()

const variableForm = ref<DeviceActionInstruction>({
  deviceId: instruction.value.deviceId,
  deviceActionId: instruction.value.deviceActionId,
  input: instruction.value.input,
})

watch(
  () => props.instruction,
  async (val) => {
    instruction.value = val.instruction as DeviceActionInstruction
    updateInstruction()
  },
  { immediate: true },
)

watch(
  () => variableForm.value.deviceActionId,
  async (val) => {
    if (device.value && val != selectedAction.value?.id) {
      selectedAction.value = device.value.actions.find((act) => act.id === val)
      if (selectedAction.value) {
        variableForm.value.input = getDefaultInput(selectedAction.value.inputTypeConstraints)
      }
    }
  },
)

type TypeDTO = {
  type: string
  class: string
  constraints: {
    min?: number
    max?: number
    values?: Set<string>
  }
}

function variableType(): TypeDTO {
  if (selectedAction.value) {
    const typeC = selectedAction.value.inputTypeConstraints
    if (typeC.__brand === 'IntRange') {
      return {
        type: 'range',
        class: 'range',
        constraints: {
          min: typeC.min,
          max: typeC.max,
        },
      }
    }

    if (typeC.__brand === 'DoubleRange') {
      return {
        type: 'number',
        class: 'input',
        constraints: {
          min: typeC.min,
          max: typeC.max,
        },
      }
    }

    if (typeC.__brand === 'Enum') {
      return {
        type: 'select',
        class: 'select',
        constraints: {
          values: typeC.values,
        },
      }
    }

    switch (typeC.type) {
      case Type.BooleanType:
        return {
          type: 'checkbox',
          class: 'toggle',
          constraints: {},
        }
      case Type.ColorType:
        return {
          type: 'color',
          class: '',
          constraints: {},
        }
      case Type.DoubleType:
      case Type.IntType:
        return {
          type: 'number',
          class: 'input',
          constraints: {},
        }
      case Type.StringType:
        return {
          type: 'text',
          class: 'input',
          constraints: {},
        }
      case Type.VoidType:
        return {
          type: 'null',
          class: 'null',
          constraints: {},
        }
    }
  } else {
    return {
      type: 'null',
      class: 'null',
      constraints: {},
    }
  }
}

onMounted(() => updateInstruction())

function updateInstruction() {
  try {
    loadingOverlay.startLoading()
    const deviceGroups = groupsStore.deviceGroups(instruction.value.deviceId)
    if (deviceGroups.length > 0) {
      device.value = groupsStore.getDeviceFromGroups(instruction.value.deviceId)!
    } else {
      device.value = devicesStore.getDevice(instruction.value.deviceId)
    }
    action.value = device.value?.actions.find((act) => act.id === instruction.value.deviceActionId)
    selectedAction.value = action.value
  } finally {
    loadingOverlay.stopLoading()
  }
}

function openDialog() {
  if (props.edit) {
    variableForm.value.deviceId = instruction.value.deviceId
    variableForm.value.deviceActionId = instruction.value.deviceActionId
    variableForm.value.input = instruction.value.input
    const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
    dialog.showModal()
  }
}

function handleConfirm() {
  instructionsStore.changeInstruction(props.instruction, {
    type: InstructionType.DeviceActionInstruction,
    instruction: {
      deviceId: variableForm.value.deviceId,
      deviceActionId: variableForm.value.deviceActionId,
      input: variableType().type === 'null' ? null : variableForm.value.input,
    },
  })
  closeDialog()
}

function closeDialog() {
  const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
  dialog.close()
}

</script>
