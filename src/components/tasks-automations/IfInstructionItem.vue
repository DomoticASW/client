<template>
  <!-- If card -->

  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-base grid grid-cols-4 px-4">
        <template v-if="moveInstruction !== undefined">
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1"
            @click="moveInstruction(instruction, 'up')"
          ></button>
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2"
            @click="moveInstruction(instruction, 'down')"
          ></button>
        </template>
        <p>If</p>
        <div class="font-bold grid grid-cols-5 col-span-3 row-span-2">
          <p class="truncate col-span-2">{{ instruction.left }}</p>
          <p class="truncate">{{ operatorSymbol }}</p>
          <p class="truncate col-span-2">{{ instruction.right }}</p>
          <template v-if="moveInstruction !== undefined">
            <button
              class="btn btn-square fa-solid fa-xmark ml-4 row-start-1 col-start-6 place-self-center"
            ></button>
          </template>
        </div>
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
        <div class="card-body p-2 text-base">Else</div>
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
      <div class="card-body p-2 text-base">Endif</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Operator, type IfElseInstruction, type IfInstruction, type Instruction } from './types.js'
import InstructionItem from './InstructionItem.vue'

const props = defineProps<{
  instruction: IfInstruction | IfElseInstruction
  indent: string
  depth: number
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
}>()

const operatorSymbol = props.instruction.operator === Operator.GREATER ? '>' : '>='
</script>
