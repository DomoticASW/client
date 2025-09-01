<template>
  <!-- If card -->
  <InstructionLayout :colors="colors" :edit="edit" :instruction="props.instruction" :depth="depth">
    <p class="self-center">If</p>
    <p class="truncate col-span-4 font-bold text-center" v-if="!edit">
      {{ instruction.condition.leftConstantName }}
    </p>
    <p class="truncate font-bold col-span-2 text-center" v-if="!edit">{{ operatorSymbol }}</p>
    <p class="truncate font-bold col-span-4 text-center" v-if="!edit">
      {{ instruction.condition.rightConstantName }}
    </p>
    <input
      v-if="edit"
      type="text"
      class="input input-primary place-self-center h-7 text-center"
      placeholder="Constant name"
      :class="depth > 1 ? 'w-full col-span-3' : 'w-17 md:w-25 col-span-3'"
      v-model="instruction.condition.leftConstantName"
    />
    <label
      v-if="edit"
      for="negate"
      class="label text-sm md:text-base text-base-content place-self-center"
      :class="depth > 1 ? 'row-start-2 col-start-2 mr-3' : 'col-span-2'"
    >
      Not
      <input
        name="negate"
        id="negate"
        type="checkbox"
        class="checkbox checkbox-primary checkbox-sm md:checkbox-md"
        v-model="instruction.condition.negate"
      />
    </label>
    <select
      v-if="edit"
      v-model="instruction.condition.conditionOperatorType"
      class="select select-primary w-17 md:w-20 place-self-center h-7"
      :class="depth > 1 ? 'row-start-2 col-start-3 ml-1' : 'col-span-3'"
    >
      <option v-for="operator in ConditionOperatorType" :key="operator" :value="operator">
        {{ getOperator(operator) }}
      </option>
    </select>
    <input
      v-if="edit"
      type="text"
      class="input input-primary place-self-center h-7 text-center"
      :class="depth > 1 ? 'row-start-3 col-start-2 col-span-3 w-full' : 'col-span-3 w-17 md:w-25'"
      placeholder="Constant name"
      v-model="instruction.condition.rightConstantName"
    />
  </InstructionLayout>

  <div class="grid grid-cols-24">
    <div class="row-span-full bg-secondary w-[2px] rounded-3xl" v-if="depth <= 3"></div>
    <div class="-mt-2 -mb-2" :class="depth <= 3 ? 'col-span-23' : 'col-span-full'">
      <!-- Then instructions -->
      <InstructionItem
        v-for="(ins, i) in instruction.thenInstructions"
        :key="id + '-then-' + i.toString()"
        :id="id + '-then' + i.toString()"
        :instruction="ins"
        :edit="edit"
        :depth="depth + 1"
      />
    </div>
  </div>

  <!-- Else block -->
  <template v-if="'elseInstructions' in instruction">
    <div :class="['card my-2', colors]">
      <div class="card-body p-2 text-base">Else</div>
    </div>
    <div class="grid grid-cols-24">
      <div class="row-span-full bg-secondary w-[2px] rounded-3xl" v-if="depth <= 3"></div>
      <div class="-mt-2 -mb-2" :class="depth <= 3 ? 'col-span-23' : 'col-span-full'">
        <InstructionItem
          v-for="(ins, i) in instruction.elseInstructions"
          :key="id + '-else-' + i.toString()"
          :id="id + '-else' + i.toString()"
          :instruction="ins"
          :edit="edit"
          :depth="depth + 1"
        />
      </div>
    </div>
  </template>

  <!-- Endif card -->
  <div :class="['card my-2', colors]">
    <div class="card-body p-2 text-base">Endif</div>
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
  colors: string
  edit: boolean
  depth: number
}>()

const instruction = ref(props.instruction.instruction as IfInstruction | IfElseInstruction)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as IfInstruction | IfElseInstruction
  },
  { immediate: true }
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
