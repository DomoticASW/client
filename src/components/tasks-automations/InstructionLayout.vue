<template>
  <div :class="indent">
    <div :class="['card card-sm my-2 border border-neutral shadow-lg', colors]">
      <div
        class="card-body text-base grid px-4"
        :class="
          instruction.type === InstructionType.IfInstruction ||
          instruction.type === InstructionType.IfElseInstruction ||
          (instruction.type === InstructionType.WaitInstruction && edit)
            ? 'grid-cols-3'
            : 'grid-cols-2'
        "
      >
        <template v-if="edit">
          <button
            class="btn btn-xs btn-square btn-neutral fa-solid fa-angle-up col-end-1"
            @click="instructionsStore.moveInstruction(props.instruction, 'up')"
            @click.stop
          ></button>
          <button
            class="btn btn-xs btn-square btn-neutral fa-solid fa-angle-down row-start-2"
            @click="instructionsStore.moveInstruction(props.instruction, 'down')"
            @click.stop
          ></button>
        </template>
        <slot></slot>
        <template v-if="edit">
          <button
            class="btn btn-square fa-solid btn-neutral fa-xmark row-start-1 place-self-center row-span-2"
            :class="
              instruction.type === InstructionType.IfInstruction ||
              instruction.type === InstructionType.IfElseInstruction
                ? 'ml-4 col-start-7'
                : instruction.type === InstructionType.WaitInstruction && edit
                  ? 'col-start-4'
                  : 'col-start-3'
            "
            @click="instructionsStore.removeInstruction(props.instruction)"
            @click.stop
          ></button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InstructionType, type Instruction } from '@/model/scripts/Instruction'
import { useInstructionsStore } from '@/stores/instructions'

const props = defineProps<{
  instruction: Instruction
  indent: string
  colors: string
  edit: boolean
}>()

const instructionsStore = useInstructionsStore()
</script>
