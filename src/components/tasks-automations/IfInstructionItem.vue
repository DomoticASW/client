<template>
  <!-- If card -->
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p>If</p>
    <div class="font-bold grid grid-cols-5 col-span-3 row-span-2">
      <p class="truncate col-span-2">{{ instruction.condition.leftConstantName }}</p>
      <p class="truncate">{{ operatorSymbol }}</p>
      <p class="truncate col-span-2">{{ instruction.condition.rightConstantName }}</p>
    </div>
  </InstructionLayout>

  <!-- Then instructions -->
  <InstructionItem
    v-for="(ins, i) in instruction.thenInstructions"
    :key="id + 'then-' + i"
    :id="id + 'then' + i.toString()"
    :instruction="ins"
    :depth="depth + 1"
    :edit="edit"
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
      :key="id + 'else-' + i"
      :id="id + 'else' + i.toString()"
      :instruction="ins"
      :depth="depth + 1"
      :edit="edit"
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
import {
  type IfInstruction,
  type IfElseInstruction,
  ConditionOperatorType,
  type Instruction,
} from '@/model/scripts/Instruction'
import InstructionItem from './InstructionItem.vue'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  id: string
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const instruction = ref(props.instruction.instruction as IfInstruction | IfElseInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as IfInstruction | IfElseInstruction
  },
  { immediate: true },
)

const operatorSymbol = getOperator()

function getOperator() {
  switch (instruction.value.condition.conditionOperatorType) {
    case ConditionOperatorType.BooleanEOperator:
    case ConditionOperatorType.ColorEOperator:
    case ConditionOperatorType.StringEOperator:
    case ConditionOperatorType.NumberEOperator:
      return '=='
    case ConditionOperatorType.NumberGEOperator:
      return '>='
    case ConditionOperatorType.NumberGOperator:
      return '>'
    case ConditionOperatorType.NumberLEOperator:
      return '<='
    case ConditionOperatorType.NumberLOperator:
      return '<'
  }
}
</script>
