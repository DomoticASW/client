<template>
  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-sm grid grid-cols-2 px-4">
        <p>Constant</p>
        <p class="font-bold justify-self-center truncate">{{ instruction.name }}</p>
        <p class="col-start-2 justify-self-center truncate"> {{ instruction.value }} </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConstantInstruction } from './types.js'

defineProps<{
  instruction: ConstantInstruction,
  indent: string,
  depth: number,
  colors: string
}>()
</script>
