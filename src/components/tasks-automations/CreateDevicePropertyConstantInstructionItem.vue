<template>
<div :class="indent">
  <div :class="['card card-sm my-2', colors]">
    <div class="card-body text-sm grid grid-cols-2 px-4">
      <p class="truncate">{{ instruction.deviceId }}</p>
      <p class="font-bold justify-self-center truncate">{{ instruction.name }}</p>

      <p class="text-xs truncate">{{ instruction.devicePropertyId }}</p>
      <p class="justify-self-center truncate">{{ instruction.value }}</p>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
import type { CreateDevicePropertyConstantInstruction } from './types.js'

defineProps<{
  instruction: CreateDevicePropertyConstantInstruction,
  indent: string,
  depth: number,
  colors: string
}>()
</script>
