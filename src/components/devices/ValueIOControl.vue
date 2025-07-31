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
import { computed, ref, watch } from 'vue'

const { typeConstraints, isInput } = defineProps<{
  typeConstraints: TypeConstraints<unknown>
  isInput: boolean
}>()
const type = computed(() => typeConstraints.type)
const value = defineModel({ required: true })
const isInputValid = defineModel<boolean>('isInputValid', { required: false })

watch(value, (newValue) => {
  isInputValid.value = true
  if (type.value == Type.IntType && !Number.isInteger(newValue)) {
    isInputValid.value = false
  }
  if (
    isRangeTypeConstraints(typeConstraints) &&
    ((newValue as number) < typeConstraints.min || (newValue as number) > typeConstraints.max)
  ) {
    isInputValid.value = false
  }
  if (isEnumTypeConstraints(typeConstraints) && typeConstraints.values.has(newValue as string)) {
    isInputValid.value = false
  }
})

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
function setColor(hex: string) {
  const rgb = hexRgb(hex)
  value.value = Color(rgb.red, rgb.green, rgb.blue)
}

const rangePreview = ref<number | undefined>()
</script>

<template>
  <div v-if="type === Type.BooleanType">
    <input type="checkbox" v-model="value" class="toggle" :disabled="!isInput" />
  </div>
  <div v-if="type === Type.StringType">
    <div v-if="isInput">
      <div v-if="isEnumTypeConstraints(typeConstraints)">
        <select class="select" v-model="value">
          <option v-for="v in typeConstraints.values" :key="v">{{ v }}</option>
        </select>
      </div>
      <input v-else type="text" v-model.lazy="value" />
    </div>
    <span v-else> {{ value }} </span>
  </div>
  <div v-if="type === Type.IntType || type === Type.DoubleType">
    <div v-if="isRangeTypeConstraints(typeConstraints)" class="flex flex-col max-w-xs">
      <!-- TODO: user can still input non valid values -->
      <span class="self-center">{{ rangePreview ?? value }}</span>
      <input
        type="range"
        class="range range-primary"
        :min="typeConstraints.min"
        :max="typeConstraints.max"
        :step="type == Type.IntType ? 1 : 'any'"
        :disabled="!isInput"
        @mouseup="rangePreview = undefined"
        @input="rangePreview = Number.parseFloat(($event.target as HTMLInputElement).value)"
        @change="((value = rangePreview), (rangePreview = undefined))"
        :value="rangePreview ?? value"
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
      v-model.lazy="value"
    />
    <span v-else> {{ value }} </span>
  </div>
  <div v-if="type === Type.ColorType">
    <input
      type="color"
      @change="setColor(($event.target! as HTMLInputElement).value)"
      :value="'#' + rgbHex((value as Color).r, (value as Color).g, (value as Color).b)"
      :disabled="!isInput"
    />
  </div>
</template>
