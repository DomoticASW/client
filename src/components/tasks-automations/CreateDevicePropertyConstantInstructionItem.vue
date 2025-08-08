<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
    @click="openDialog"
    v-if="device && property"
    :class="[edit ? 'cursor-pointer transition-all hover:bg-secondary' : '']"
  >
    <p class="truncate">{{ device.name }}</p>
    <p class="font-bold text-center truncate">{{ instruction.name }}</p>
    <p class="text-xs truncate">
      {{ property.name }}
    </p>
    <p class="text-center truncate" v-if="property.typeConstraints.type !== Type.ColorType">
      {{ property.value }}
    </p>
    <input
      v-else
      class="col-start-2 place-self-center"
      type="color"
      disabled
      :value="property.value"
    />
  </InstructionLayout>

  <dialog :id="id" class="modal" v-if="device && property">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mx-2 mb-2">Device property</h3>
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
        <div class="modal-action grid grid-cols-3 w-full">
          <button type="button" class="btn btn-error col-start-1" @click="closeDialog">
            Close
          </button>
          <button type="submit" class="btn col-start-3">Confirm</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import {
  InstructionType,
  type CreateDevicePropertyConstantInstruction,
  type Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { Device, DeviceProperty } from '@/model/devices-management/Device'
import { findDevice } from '@/api/devices-management/requests/devices'
import { useUserInfoStore } from '@/stores/user-info'
import { Type } from '@/model/Type'
import { useInstructionsStore } from '@/stores/instructions'
import { io } from 'socket.io-client'

const props = defineProps<{
  id: string
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const instructionsStore = useInstructionsStore()
const userInfo = useUserInfoStore()
const instruction = ref(props.instruction.instruction as CreateDevicePropertyConstantInstruction)
const device = ref<Device>()
const property = ref<DeviceProperty<unknown>>()

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
    await updateInstruction()
  },
  { immediate: true },
)

onMounted(async () => await updateInstruction())

async function updateInstruction() {
  device.value = await findDevice(instruction.value.deviceId, userInfo.token)
  property.value = device.value.properties.find(
    (prop) => prop.id === instruction.value.devicePropertyId,
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

async function handleConfirm() {
  const device = await findDevice(variableForm.value.deviceId, userInfo.token)
  const property = device.properties.find((prop) => prop.id === variableForm.value.devicePropertyId)
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

type PropertyUpdateDTO = { deviceId: string; propertyId: string; value: unknown }
const socket = io('/api/devices/property-updates')
  .on('connect', () => socket.emit('subscribe', { deviceId: device.value?.id }))
  .on('device-property-update', (data: PropertyUpdateDTO) => {
    if (data.deviceId == device.value?.id) {
      const property = device.value?.properties.find((p) => p.id == data.propertyId)
      if (property) {
        property.value = data.value
      }
    }
  })
onUnmounted(() => {
  socket.close()
})
</script>
