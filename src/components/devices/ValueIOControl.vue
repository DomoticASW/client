<!--
 WARNING: note that when binding a v-model to this component it can assume non-valid
 values, you should instead listen for the "input" event which will trigger only when the
 v-model has a valid value.
  -->
<script setup lang="ts">
import {
  Color,
  type IntRange,
  type DoubleRange,
  type TypeConstraints,
  type Enum,
} from '@/model/devices-management/Types'
import { Type } from '@/model/Type'
import hexRgb from 'hex-rgb'
import rgbHex from 'rgb-hex'
import { computed, watch } from 'vue'

const { typeConstraints, val, isInput } = defineProps<{
  typeConstraints: TypeConstraints<unknown>
  val: unknown
  /**
   * Tells the control if it should also register user input
   */
  isInput: boolean
}>()
const emit = defineEmits<{
  /**
   * An event that gets triggered when the user confirmed a valid input
   */
  input: [value: unknown]
}>()

const value = computed({
  get: () => {
    if (val) {
      return val
    } else {
      return defaultInitialValueForTypeConstraints(typeConstraints)
    }
  },
  set: (newValue) => {
    validateAndEmit(newValue)
  },
})

/** This is meant to only be read by the parent and it indicates whether value is valid or not */
const isInputValid = defineModel<boolean>('isInputValid')
watch(value, (v) => {
  isInputValid.value = validateInput(v)
})

function validateInput(input: unknown): boolean {
  if (isEnumTypeConstraints(typeConstraints) && !typeConstraints.values.has(input as string))
    return false
  if (type.value == Type.IntType && !Number.isInteger(input)) return false
  if (
    typeof input == 'number' &&
    isRangeTypeConstraints(typeConstraints) &&
    (input < typeConstraints.min || input > typeConstraints.max)
  ) {
    return false
  }
  return true
}
function validateAndEmit(input: unknown) {
  if (validateInput(input)) {
    emit('input', input)
  }
}

const type = computed(() => typeConstraints.type)

function isEnumTypeConstraints(tc: TypeConstraints<unknown>): tc is Enum {
  return tc.__brand == 'Enum'
}
function isRangeTypeConstraints(tc: TypeConstraints<unknown>): tc is IntRange | DoubleRange {
  return isIntRangeTypeConstraints(tc) || isDoubleRangeTypeConstraints(tc)
}
function isIntRangeTypeConstraints(tc: TypeConstraints<unknown>): tc is IntRange {
  return tc.__brand == 'IntRange'
}
function isDoubleRangeTypeConstraints(tc: TypeConstraints<unknown>): tc is DoubleRange {
  return tc.__brand == 'DoubleRange'
}
function hexToColor(hex: string) {
  const rgb = hexRgb(hex)
  return Color(rgb.red, rgb.green, rgb.blue)
}
function defaultInitialValueForTypeConstraints(tc: TypeConstraints<unknown>) {
  switch (tc.type) {
    case Type.IntType:
      return tc.__brand === 'IntRange' ? tc.min : 0
    case Type.DoubleType:
      return tc.__brand === 'DoubleRange' ? tc.min : 0
    case Type.BooleanType:
      return true
    case Type.ColorType:
      return Color(0, 0, 0)
    case Type.StringType:
      return tc.__brand === 'Enum' ? Array.from(tc.values)[0] : ''
    case Type.VoidType:
      return undefined
  }
}
</script>

<template>
  <div v-if="type === Type.BooleanType">
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :disabled="!isInput"
      v-model="value"
    />
  </div>
  <div v-if="type === Type.StringType">
    <div v-if="isInput">
      <div v-if="isEnumTypeConstraints(typeConstraints)">
        <select class="select select-primary" v-model="value">
          <option v-for="v in typeConstraints.values" :key="v" :value="v">{{ v }}</option>
        </select>
      </div>
      <input v-else type="text" v-model="value" />
    </div>
    <span v-else> {{ value }} </span>
  </div>
  <div v-if="type === Type.IntType || type === Type.DoubleType">
    <div v-if="isRangeTypeConstraints(typeConstraints)" class="flex flex-col max-w-xs">
      <span class="self-center">{{ value }}</span>
      <input
        type="range"
        class="range range-primary"
        :min="typeConstraints.min"
        :max="typeConstraints.max"
        :step="type == Type.IntType ? 1 : 'any'"
        :disabled="!isInput"
        v-model.number="value"
      />
      <div class="flex flex-row justify-between">
        <span class="opacity-30">{{ typeConstraints.min }}</span>
        <span class="opacity-30">{{ typeConstraints.max }}</span>
      </div>
    </div>
    <input
      v-else-if="isInput"
      class="input input-primary validator field-sizing-content min-w-[8rem]"
      type="number"
      :step="type == Type.IntType ? 1 : 'any'"
      v-model.number="value"
    />
    <span v-else> {{ value }} </span>
  </div>
  <div v-if="type === Type.ColorType">
    <input
      type="color"
      :disabled="!isInput"
      :value="'#' + rgbHex((value as Color).r, (value as Color).g, (value as Color).b)"
      @change="value = hexToColor(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
