<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
    v-if="device && action"
  >
    <p class="truncate">{{ device.name }}</p>

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
</template>

<script setup lang="ts">
import type { DeviceActionInstruction, Instruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import type { Device, DeviceAction } from '@/model/devices-management/Device'
import { useUserInfoStore } from '@/stores/user-info'
import { useInstructionsStore } from '@/stores/instructions'
import { findDevice } from '@/api/devices-management/requests/devices'
import { Type } from '@/model/Type'

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
const instruction = ref(props.instruction.instruction as DeviceActionInstruction)
const device = ref<Device>()
const action = ref<DeviceAction<unknown>>()

const variableForm = ref<DeviceActionInstruction>({
  deviceId: instruction.value.deviceId,
  deviceActionId: instruction.value.deviceActionId,
  input: instruction.value.input,
})

watch(
  () => props.instruction,
  async (val) => {
    instruction.value = val.instruction as DeviceActionInstruction
    await updateInstruction()
  },
  { immediate: true },
)

onMounted(async () => await updateInstruction())

async function updateInstruction() {
  device.value = await findDevice(instruction.value.deviceId, userInfo.token)
  action.value = device.value.actions.find((prop) => prop.id === instruction.value.deviceActionId)
}
</script>
