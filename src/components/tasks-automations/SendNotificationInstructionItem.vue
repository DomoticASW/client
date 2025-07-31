<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p class="truncate">Send notification to</p>
    <p v-if="!edit" class="font-bold text-center truncate">{{ instruction.email }}</p>
    <select v-model="instruction.email" v-else class="select text-center truncate h-7 text-base-content"> <!-- Show all the users -->
      <option :value="instruction.email" selected>{{ instruction.email }}</option>
    </select>
    <!-- To see if it is possible to retrieve the name of a user just by using its email -->

    <label class="label mb-2 text-secondary-content col-span-2">Message sent</label>
    <div class="row-start-3 col-span-full">
      <textarea
        placeholder="Message sent"
        class="w-full textarea text-base-content"
        :disabled="!edit"
        v-model="instruction.message"
      />
    </div>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, SendNotificationInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const instruction = ref(props.instruction.instruction as SendNotificationInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as SendNotificationInstruction
  },
  { immediate: true },
)
</script>
