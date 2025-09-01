<template>
  <InstructionLayout
    :colors="colors"
    :edit="edit"
    :instruction="props.instruction"
    @click="openDialog"
    v-if="device && property"
    :class="edit ? 'cursor-pointer transition-all duration-100 hover:bg-primary/10' : ''"
  >
    <DeviceNameAndGroup :id="id" :device="device" />
    <p class="font-bold text-center truncate">{{ instruction.name }}</p>
    <p class="text-xs truncate">
      {{ property.name }}
    </p>
    <div class="text-center truncate">
      {{ property.typeConstraints.type.slice(0, -4) }}
      <button
        class="fa-circle-info fa-solid fa-lg btn btn-ghost btn-xs btn-circle"
        v-if="property.typeConstraints.__brand !== 'None'"
        @click.stop="openInfoDialog"
      ></button>
    </div>
  </InstructionLayout>

  <dialog :id="id + '_info'" class="modal modal-sm">
    <div class="modal-box max-w-sm" v-if="property">
      <p class="card-title mb-2">{{ property.name }} type constraints info</p>
      <div v-if="property.typeConstraints.__brand === 'Enum'">
        <p>Possible values for {{ property.name }} property:</p>
        <ul class="list-inside list-disc">
          <li class="font-bold" v-for="value in property.typeConstraints.values" :key="value">
            {{ value }}
          </li>
        </ul>
      </div>
      <p v-else-if="property.typeConstraints.__brand !== 'None'">
        The {{ property.name }} property has a minimum value of
        <span class="font-bold">{{
          property.typeConstraints.min.toFixed(
            property.typeConstraints.__brand === 'DoubleRange' ? 2 : 0
          )
        }}</span>
        and a maximum value of
        <span class="font-bold">{{
          property.typeConstraints.max.toFixed(
            property.typeConstraints.__brand === 'DoubleRange' ? 2 : 0
          )
        }}</span
        >.
      </p>
      <div class="modal-action mt-2">
        <form method="dialog">
          <button class="btn btn-primary">Ok</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>

  <dialog :id="id" class="modal" v-if="device && property">
    <div class="modal-box max-w-sm">
      <p class="card-title mx-2 mb-2">Device property</p>
      <form @submit.prevent="handleConfirm">
        <!-- Selection of a property -->
        <label for="properties" class="fieldset-legend text-sm mx-3"
          >{{ device.name }} properties</label
        >
        <select
          v-model="variableForm.devicePropertyId"
          class="select mt-2 mx-2"
          name="properties"
          id="properties"
        >
          <option disabled>Pick a property</option>
          <option
            v-for="p in device.properties"
            :key="p.id"
            :selected="p.id == property.id"
            :value="p.id"
          >
            {{ p.name }}
          </option>
        </select>
        <!-- Change constant name -->
        <label for="constant_name" class="fieldset-legend text-sm mx-3">Constant name</label>
        <input
          type="text"
          class="input mt-2 mx-2"
          v-model="variableForm.name"
          name="constant_name"
          id="constant_name"
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
  type CreateDevicePropertyConstantInstruction,
  type Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import type { Device, DeviceProperty } from '@/model/devices-management/Device'
import { useInstructionsStore } from '@/stores/instructions'
import DeviceNameAndGroup from '../DeviceNameAndGroup.vue'
import { useDevicesStore } from '@/stores/devices'

const props = defineProps<{
  id: string
  instruction: Instruction
  colors: string
  edit: boolean
}>()

const instructionsStore = useInstructionsStore()
const instruction = ref(props.instruction.instruction as CreateDevicePropertyConstantInstruction)
const device = ref<Device>()
const property = ref<DeviceProperty<unknown>>()
const devicesStore = useDevicesStore()

const variableForm = ref<CreateDevicePropertyConstantInstruction>({
  name: instruction.value.name,
  type: instruction.value.type,
  deviceId: instruction.value.deviceId,
  devicePropertyId: instruction.value.devicePropertyId,
})

watch(
  () => props.instruction,
  async (val) => {
    instruction.value = val.instruction as CreateDevicePropertyConstantInstruction
    updateInstruction()
  },
  { immediate: true }
)

onMounted(() => updateInstruction())

function updateInstruction() {
  device.value = devicesStore.getDevice(instruction.value.deviceId)
  property.value = device.value?.properties.find(
    (prop) => prop.id === instruction.value.devicePropertyId
  )
}

function openDialog() {
  if (props.edit) {
    variableForm.value.deviceId = instruction.value.deviceId
    variableForm.value.devicePropertyId = instruction.value.devicePropertyId
    variableForm.value.name = instruction.value.name
    variableForm.value.type = instruction.value.type
    const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
    dialog.showModal()
  }
}

function handleConfirm() {
  const device = devicesStore.getDevice(variableForm.value.deviceId)
  const property = device?.properties.find(
    (prop) => prop.id === variableForm.value.devicePropertyId
  )
  if (property) {
    variableForm.value.type = property.typeConstraints.type
    instructionsStore.changeInstruction(props.instruction, {
      type: InstructionType.CreateDevicePropertyConstantInstruction,
      instruction: {
        name: variableForm.value.name,
        type: variableForm.value.type,
        deviceId: variableForm.value.deviceId,
        devicePropertyId: variableForm.value.devicePropertyId,
      },
    })
  }
  closeDialog()
}

function closeDialog() {
  const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
  dialog.close()
}

function openInfoDialog() {
  const dialog = document.getElementById(props.id.toString() + '_info') as HTMLDialogElement
  dialog.showModal()
}
</script>
