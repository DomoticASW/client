<template>
  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-sm grid grid-cols-2 px-4">
        <p class="truncate">{{ instruction.deviceId }}</p>
        <p class="font-bold justify-self-center truncate" v-if="'values' in instruction.typeConstraints"> <!-- Enum type constraint, to do better check -->
          {{ instruction.input }}
        </p>

        <p :class="['truncate', instruction.typeConstraints.type === Type.VoidType ? 'font-bold justify-self-center' : 'text-xs']">{{ instruction.deviceActionId }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Type, type DeviceActionInstruction } from './types.js'

defineProps<{
  instruction: DeviceActionInstruction,
  indent: string,
  depth: number,
  colors: string
}>()

</script>
