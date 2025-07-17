<template>
  <!-- If card -->

  <div :class="indent">
    <div class="card bg-neutral text-neutral-content my-2">
      <div class="card-body text-sm grid grid-cols-2 px-4">
        <p>If</p>
        <p class="font-bold justify-self-center truncate">
          {{ instruction.left }} {{ operatorSymbol }} {{ instruction.right }}
        </p>
      </div>
    </div>
  </div>

  <!-- Then instructions -->
  <InstructionItem
    v-for="(ins, i) in instruction.then"
    :key="'then-' + i"
    :instruction="ins"
    :depth="(depth ?? 0) + 1"
  />

  <!-- Else block -->
  <template v-if="'else' in instruction">
    <div :class="indent">
      <div class="card bg-neutral text-neutral-content my-2 text-xs">
        <div class="card-body p-2">
          Else
        </div>
      </div>
    </div>
    <InstructionItem
      v-for="(ins, i) in instruction.else"
      :key="'else-' + i"
      :instruction="ins"
      :depth="(depth ?? 0) + 1"
    />
  </template>

  <!-- Endif card -->
  <div :class="indent">
    <div class="card bg-base-300 text-base-content my-2 text-xs">
      <div class="card-body p-2">
        Endif
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Operator, type IfElseInstruction, type IfInstruction } from './types.js'
import InstructionItem from './InstructionItem.vue'

const props = defineProps<{
  instruction: IfInstruction | IfElseInstruction,
  indent: string,
  depth: number
}>()

const operatorSymbol = props.instruction.operator === Operator.GREATER ? '>' : '>='
</script>
