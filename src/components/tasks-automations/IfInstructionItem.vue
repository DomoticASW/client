<template>
  <!-- If card -->

  <div :class="indent">
    <div :class="['card card-sm my-2', colors]">
      <div class="card-body text-base grid grid-cols-4 px-4">
        <template v-if="moveInstruction !== undefined">
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-up col-end-1"
            @click="moveInstruction(props.instruction, 'up')"
          ></button>
          <button
            class="btn btn-xs btn-square fa-solid fa-angle-down row-start-2"
            @click="moveInstruction(props.instruction, 'down')"
          ></button>
        </template>
        <p>If</p>
        <div class="font-bold grid grid-cols-5 col-span-3 row-span-2">
          <p class="truncate col-span-2">{{ instruction.condition.leftConstantName }}</p>
          <p class="truncate">{{ operatorSymbol }}</p>
          <p class="truncate col-span-2">{{ instruction.condition.rightConstantName }}</p>
          <template v-if="removeInstruction !== undefined">
            <button
              class="btn btn-square fa-solid fa-xmark ml-4 row-start-1 col-start-6 place-self-center"
              @click="removeInstruction(props.instruction)"
            ></button>
          </template>
        </div>
      </div>
    </div>
  </div>

  <!-- Then instructions -->
  <InstructionItem
    v-for="(ins, i) in instruction.thenInstructions"
    :key="'then-' + i"
    :instruction="ins"
    :depth="depth + 1"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />

  <!-- Else block -->
  <template v-if="'elseInstructions' in instruction">
    <div :class="indent">
      <div :class="['card my-2', colors]">
        <div class="card-body p-2 text-base">Else</div>
      </div>
    </div>
    <InstructionItem
      v-for="(ins, i) in instruction.elseInstructions"
      :key="'else-' + i"
      :instruction="ins"
      :depth="depth + 1"
      :moveInstruction="moveInstruction"
      :removeInstruction="removeInstruction"
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
import { type IfInstruction, type IfElseInstruction, ConditionOperatorType, type Instruction } from '@/model/scripts/Instruction';
import InstructionItem from './InstructionItem.vue'

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  moveInstruction?: (instr: Instruction, dir: 'up' | 'down') => void
  removeInstruction?: (instr: Instruction) => void
}>()

const instruction = props.instruction.instruction as IfInstruction | IfElseInstruction
const operatorSymbol = getOperator()

function getOperator() {
  switch(instruction.condition.conditionOperatorType) {
    case ConditionOperatorType.BooleanEOperator:
    case ConditionOperatorType.ColorEOperator:
    case ConditionOperatorType.StringEOperator:
    case ConditionOperatorType.NumberEOperator:
      return "=="
    case ConditionOperatorType.NumberGEOperator:
      return ">="
    case ConditionOperatorType.NumberGOperator:
      return ">"
    case ConditionOperatorType.NumberLEOperator:
      return "<="
    case ConditionOperatorType.NumberLOperator:
      return "<"
  }
}
</script>
