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
import { computed } from 'vue'

const { typeConstraints, isInput } = defineProps<{
  typeConstraints: TypeConstraints<unknown>
  isInput: boolean
}>()
const emit = defineEmits<{ input: [value: unknown] }>()
const value = defineModel({ required: true })

function validateAndEmit(input: unknown) {
  if (isEnumTypeConstraints(typeConstraints) && !typeConstraints.values.has(input as string)) return
  if (type.value == Type.IntType && !Number.isInteger(input)) return
  if (
    typeof input == 'number' &&
    isRangeTypeConstraints(typeConstraints) &&
    (input < typeConstraints.min || input > typeConstraints.max)
  ) {
    return
  }
  emit('input', input)
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
</script>

<template>
  <div v-if="type === Type.BooleanType">
    <input
      type="checkbox"
      class="toggle"
      :disabled="!isInput"
      v-model="value"
      @change="validateAndEmit(value)"
    />
  </div>
  <div v-if="type === Type.StringType">
    <div v-if="isInput">
      <div v-if="isEnumTypeConstraints(typeConstraints)">
        <select class="select" v-model="value" @change="validateAndEmit(value)">
          <option v-for="v in typeConstraints.values" :key="v">{{ v }}</option>
        </select>
      </div>
      <input v-else type="text" v-model="value" @change="validateAndEmit(value)" />
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
        @change="validateAndEmit(value)"
      />
      <div class="flex flex-row justify-between">
        <span class="opacity-30">{{ typeConstraints.min }}</span>
        <span class="opacity-30">{{ typeConstraints.max }}</span>
      </div>
    </div>
    <input
      v-else-if="isInput"
      class="input validator field-sizing-content min-w-[8rem]"
      type="number"
      :step="type == Type.IntType ? 1 : 'any'"
      v-model.number="value"
      @change="validateAndEmit(value)"
    />
    <span v-else> {{ value }} </span>
  </div>
  <div v-if="type === Type.ColorType">
    <input
      type="color"
      :disabled="!isInput"
      :value="'#' + rgbHex((value as Color).r, (value as Color).g, (value as Color).b)"
      @change="
        ((value = hexToColor(($event.target as HTMLInputElement).value)), validateAndEmit(value))
      "
    />
  </div>
</template>
