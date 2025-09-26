<template>
  <InstructionLayout :colors="colors" :edit="edit" :instruction="props.instruction">
    <p>Wait</p>
    <p v-if="!edit" class="font-bold truncate text-center">{{ duration }}</p>
    <div v-else class="col-span-2 place-self-end">
      <label :for="'period_' + id" class="hidden">Choose a number of period</label>
      <input
        type="number"
        v-model="time"
        class="input h-7 max-w-17 p-2 input-primary text-center mr-4"
        :name="'period_' + id"
        :id="'period_' + id"
      />
      <label :for="'time_unit_' + id" class="hidden">Select a time unit</label>
      <select
        v-model="timeUnit"
        class="select h-7 w-28 select-primary text-center"
        :name="'time_unit_' + id"
        :id="'time_unit_' + id"
      >
        <option selected disabled>Time unit</option>
        <option value="seconds">Seconds</option>
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
      </select>
    </div>
  </InstructionLayout>
</template>

<script setup lang="ts">
import { type Instruction, type WaitInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue'
import { convertToSeconds, decomposeToLargestUnit, formatDuration } from './timeUtils'

const props = defineProps<{
  id: string
  instruction: Instruction
  colors: string
  edit: boolean
}>()

const instruction = ref(props.instruction.instruction as WaitInstruction)
const duration = formatDuration(instruction.value.seconds)
const timeUnit = ref(decomposeToLargestUnit(instruction.value.seconds).unit)
const time = ref<number>(decomposeToLargestUnit(instruction.value.seconds).value)

watch(
  () => time.value,
  (val) => updateSeconds(val, timeUnit.value),
  {
    immediate: true,
  }
)

watch(
  () => timeUnit.value,
  (val) => updateSeconds(time.value, val),
  {
    immediate: true,
  }
)

function updateSeconds(first: number, second: 'seconds' | 'minutes' | 'hours' | 'days') {
  ;(props.instruction.instruction as WaitInstruction).seconds = convertToSeconds(first, second)
}

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as WaitInstruction
  },
  { immediate: true }
)
</script>
