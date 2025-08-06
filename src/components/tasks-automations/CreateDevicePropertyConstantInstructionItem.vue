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

  <dialog :id="id" class="modal">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mx-2 mb-2">Choose a device property</h3>
      <form @submit.prevent="handleConfirm">
        <select class="select my-2 col-span-3 text-lg">
          <option :value="undefined" disabled>Properties</option>
        </select>
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
import type {
  CreateDevicePropertyConstantInstruction,
  Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import type { Device, DeviceProperty } from '@/model/devices-management/Device'
import { findDevice } from '@/api/devices-management/requests/devices'
import { useUserInfoStore } from '@/stores/user-info'
import { Type } from '@/model/Type'

const props = defineProps<{
  id: string
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const userInfo = useUserInfoStore()
const instruction = ref(props.instruction.instruction as CreateDevicePropertyConstantInstruction)
const device = ref<Device>()
const property = ref<DeviceProperty<unknown>>()

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as CreateDevicePropertyConstantInstruction
  },
  { immediate: true },
)

onMounted(async () => {
  device.value = await findDevice(instruction.value.deviceId, userInfo.token)
  property.value = device.value.properties.find(
    (prop) => prop.id === instruction.value.devicePropertyId,
  )
})

function openDialog() {
  if (props.edit) {
    const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
    dialog.showModal()
  }
}

function handleConfirm() {
  closeDialog()
}

function closeDialog() {
  const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
  dialog.close()
}
</script>
