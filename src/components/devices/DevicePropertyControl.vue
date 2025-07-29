<script setup lang="ts">
import { type DeviceProperty } from '@/model/devices-management/Device'
import type {
  IntRange,
  DoubleRange,
  TypeConstraints,
  Color,
  Enum,
} from '@/model/devices-management/Types'
import { Type } from '@/model/Type'
import rgbHex from 'rgb-hex'
import { computed } from 'vue'

const { property: p } = defineProps<{ property: DeviceProperty<unknown> }>()
const disabled = computed(() => p.setter === undefined)

function isBooleanProperty(p: DeviceProperty<unknown>): p is DeviceProperty<boolean> {
  return p.typeConstraints.type == Type.BooleanType
}
function isStringProperty(p: DeviceProperty<unknown>): p is DeviceProperty<string> {
  return p.typeConstraints.type == Type.StringType
}
function isColorProperty(p: DeviceProperty<unknown>): p is DeviceProperty<Color> {
  return p.typeConstraints.type == Type.ColorType
}
function isNumericProperty(p: DeviceProperty<unknown>): p is DeviceProperty<number> {
  return isIntProperty(p) || isDoubleProperty(p)
}
function isIntProperty(p: DeviceProperty<unknown>): p is DeviceProperty<number> {
  return p.typeConstraints.type == Type.IntType
}
function isDoubleProperty(p: DeviceProperty<unknown>): p is DeviceProperty<number> {
  return p.typeConstraints.type == Type.DoubleType
}
function isEnumTypeConstraints(tc: TypeConstraints<unknown>): tc is Enum {
  return tc.__brand == 'Enum'
}
function isRangeTypeConstraints(tc: TypeConstraints<unknown>): tc is IntRange | DoubleRange {
  return tc.__brand == 'IntRange' || tc.__brand == 'DoubleRange'
}
</script>

<template>
  <div v-if="isBooleanProperty(p)">
    <input type="checkbox" :checked="p.value" class="toggle" :disabled="disabled" />
  </div>
  <div v-if="isStringProperty(p)">
    <div v-if="isEnumTypeConstraints(p.typeConstraints) && !disabled">
      <select class="select">
        <option v-for="v in p.typeConstraints.values" :key="v" :selected="v === p.value">
          {{ v }}
        </option>
      </select>
    </div>
    <span v-else> {{ p.value }} </span>
  </div>
  <div v-if="isNumericProperty(p)">
    <div v-if="isRangeTypeConstraints(p.typeConstraints)" class="flex flex-col">
      <input
        type="range"
        class="range"
        :min="p.typeConstraints.min"
        :max="p.typeConstraints.max"
        :value="p.value"
        :disabled="disabled"
      />
      <div class="flex flex-row justify-between">
        <span class="opacity-60">{{ p.typeConstraints.min }}</span>
        <span class="opacity-60">{{ p.typeConstraints.max }}</span>
      </div>
    </div>
    <span v-else> {{ p.value }}</span>
  </div>
  <div v-if="isColorProperty(p)">
    <input type="color" :value="rgbHex(p.value.r, p.value.g, p.value.b)" :disabled="disabled" />
  </div>
</template>
