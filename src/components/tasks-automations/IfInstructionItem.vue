<template>
  <!-- If card -->
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p class="self-center">If</p>
    <p class="truncate col-span-4 font-bold text-center" v-if="!edit">
      {{ instruction.condition.leftConstantName }}
    </p>
    <p class="truncate font-bold col-span-2 text-center" v-if="!edit">{{ operatorSymbol }}</p>
    <p class="truncate font-bold col-span-4 text-center" v-if="!edit">{{ instruction.condition.rightConstantName }}</p>
    <input
      v-if="edit"
      type="text"
      class="input text-base-content col-span-3 w-17 md:w-25 place-self-center h-7 text-center"
      placeholder="Constant name"
      v-model="instruction.condition.leftConstantName"
    />
    <select
      v-if="edit"
      v-model="instruction.condition.conditionOperatorType"
      class="select text-base-content col-span-3 w-17 md:w-20 place-self-center h-7"
    >
      <option v-for="operator in ConditionOperatorType" :key="operator" :value="operator">
        {{ getOperator(operator) }}
      </option>
    </select>
    <label v-if="edit" for="negate" class="label text-sm md:text-base text-secondary-content col-span-2 place-self-center">
      Not
      <input
        name="negate"
        id="negate"
        type="checkbox"
        class="checkbox text-secondary-content"
        v-model="instruction.condition.negate"
      />
    </label>
    <input
      v-if="edit"
      type="text"
      class="input text-base-content w-17 md:w-25 col-span-3 place-self-center h-7 text-center"
      placeholder="Constant name"
      v-model="instruction.condition.rightConstantName"
    />
  </InstructionLayout>

  <!-- Then instructions -->
  <InstructionItem
    v-for="(ins, i) in instruction.thenInstructions"
    :key="id + '-then-' + i.toString()"
    :id="id + '-then' + i.toString()"
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
      :key="id + '-else-' + i.toString()"
      :id="id + '-else' + i.toString()"
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
  type Condition,
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

const operatorSymbol = getOperatorWithNegate(instruction.value.condition)

function getOperatorWithNegate(condition: Condition) {
  switch (condition.conditionOperatorType) {
    case ConditionOperatorType.BooleanEOperator:
      return !condition.negate ? 'bool eq' : 'bool not eq'
    case ConditionOperatorType.ColorEOperator:
      return !condition.negate ? 'color eq' : 'color not eq'
    case ConditionOperatorType.StringEOperator:
      return !condition.negate ? 'is' : 'is not'
    case ConditionOperatorType.NumberEOperator:
      return !condition.negate ? '==' : '!=='
    case ConditionOperatorType.NumberGEOperator:
      return !condition.negate ? '>=' : '<'
    case ConditionOperatorType.NumberGOperator:
      return !condition.negate ? '>' : '<='
    case ConditionOperatorType.NumberLEOperator:
      return !condition.negate ? '<=' : '>'
    case ConditionOperatorType.NumberLOperator:
      return !condition.negate ? '<' : '>='
  }
}

function getOperator(operator: ConditionOperatorType) {
  switch (operator) {
    case ConditionOperatorType.BooleanEOperator:
      return 'bool eq'
    case ConditionOperatorType.ColorEOperator:
      return 'color eq'
    case ConditionOperatorType.StringEOperator:
      return 'is'
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
