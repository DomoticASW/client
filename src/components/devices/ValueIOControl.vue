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
const type = computed(() => typeConstraints.type)
const value = defineModel({ required: true })

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
    <div v-if="isRangeTypeConstraints(typeConstraints)" class="max-w-xs">
      <!-- TODO: user can still input non valid values -->
      <input
        type="range"
        class="range"
        :min="typeConstraints.min"
        :max="typeConstraints.max"
        :step="type == Type.IntType ? 1 : 'any'"
        :disabled="!isInput"
        v-model.lazy="value"
      />
      <div class="flex flex-row justify-between">
        <span class="opacity-60">{{ typeConstraints.min }}</span>
        <span class="opacity-60">{{ typeConstraints.max }}</span>
      </div>
    </div>
    <input
      v-else-if="isInput"
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
