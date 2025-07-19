<template>
  <!-- If card -->

  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-sm grid grid-cols-2 px-4">
        <template v-if="moveInstruction != undefined">
          <button class="btn btn-xs btn-shadow fa-solid fa-angle-up w-10 col-end-1" @click="moveInstruction(instruction, 'up')"></button>
          <button class="btn btn-xs btn-shadow fa-solid fa-angle-down w-10 row-start-2" @click="moveInstruction(instruction, 'down')"></button>
        </template>
        <p>If</p>
        <p class="font-bold justify-self-center truncate">
          {{ instruction.left }} {{ operatorSymbol }} {{ instruction.right }}
        </p>
      </div>
    </div>
  </div>

  <!-- Then instructions -->
  <InstructionItem
    v-for="(ins, i) in instruction.then"
    :key="'then-' + i"
    :instruction="ins"
    :depth="(depth ?? 0) + 1"
    :moveInstruction="moveInstruction"
  />

  <!-- Else block -->
  <template v-if="'else' in instruction">
    <div :class="indent">
      <div :class="['card my-2', colors]">
        <div class="card-body p-2">
          Else
        </div>
      </div>
    </div>
    <InstructionItem
      v-for="(ins, i) in instruction.else"
      :key="'else-' + i"
      :instruction="ins"
      :depth="(depth ?? 0) + 1"
      :moveInstruction="moveInstruction"
    />
  </template>

  <!-- Endif card -->
  <div :class="indent">
    <div :class="['card my-2', colors]">
      <div class="card-body p-2">
        Endif
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Operator, type IfElseInstruction, type IfInstruction, type Instruction } from './types.js'
import InstructionItem from './InstructionItem.vue'

const props = defineProps<{
  instruction: IfInstruction | IfElseInstruction,
  indent: string,
  depth: number,
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
}>()

const operatorSymbol = props.instruction.operator === Operator.GREATER ? '>' : '>='
</script>
