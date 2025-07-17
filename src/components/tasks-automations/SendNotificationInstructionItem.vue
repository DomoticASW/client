<template>
  <div :class="indent">
    <div class="card card-sm bg-neutral text-neutral-content m-2">
      <div class="card-body text-sm grid grid-cols-2 px-4">
        <p class="truncate">Send notification to</p>
        <p class="font-bold justify-self-center truncate">{{ instruction.email }}</p>

        <fieldset class="fieldset w-full justify-self-center col-span-2">
          <legend class="fieldset-legend">Message sent</legend>
          <textarea placeholder="Message sent" class="w-full textarea" disabled :value=instruction.message />
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SendNotificationInstruction } from './types.js'

defineProps<{
  instruction: SendNotificationInstruction,
  indent: string,
  depth: number
}>()
</script>
