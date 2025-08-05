<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
    v-if="device && property"
  >
    <p class="truncate">{{ device.name }}</p>
    <p class="font-bold text-center truncate">{{ instruction.name }}</p>
    <p class="text-xs truncate">
      {{ property.name }}
    </p>
    <p class="text-center truncate">{{ property.value }}</p>
  </InstructionLayout>
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

const props = defineProps<{
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
</script>
