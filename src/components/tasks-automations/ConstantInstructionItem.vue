<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
    @click="openDialog"
    :class="'cursor-pointer transition-all hover:bg-secondary'"
  >
    <p>Constant</p>
    <p class="font-bold truncate text-center">{{ instruction.name }}</p>
    <p class="col-start-2 truncate text-center">
      <template
        v-if="
          instruction.type === Type.DoubleType ||
          instruction.type === Type.IntType ||
          instruction.type === Type.StringType
        "
      >
        {{ instruction.value }}
      </template>
      <template v-else-if="instruction.type === Type.BooleanType">
        {{
          typeof instruction.value === 'boolean' ? instruction.value.toString() : 'not a boolean'
        }}
      </template>
    </p>
  </InstructionLayout>

  <dialog :id="id.toString()" class="modal">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mx-2 mb-2">Set variable</h3>
      <form @submit.prevent="handleConfirm">
        <input type="text" class="input m-2" placeholder="Name" v-model="variableForm.name" />
        <select v-model="variableForm.type" class="select m-2">
          <option selected disabled>Type</option>
          <option
            v-for="type in Object.values(Type).filter((type) => type !== Type.VoidType)"
            :value="type"
            :key="type"
          >
            {{ trimAfterSecondUppercase(type) }}
          </option>
        </select>
        <input
          v-if="variableType().type !== 'checkbox'"
          :type="variableType().type"
          :class="['m-2', variableType().class]"
          :step="variableForm.type === Type.DoubleType ? 'any' : '1'"
          placeholder="Value"
          v-model="variableForm.value"
        />
        <input
          v-else
          :type="variableType().type"
          :class="['m-2', variableType().class]"
          v-model="variableForm.value"
        />
        <div class="modal-action grid grid-cols-3 w-full">
          <button type="button" class="btn btn-error col-start-1" @click="closeDialog">
            Close
          </button>
          <button type="submit" class="btn col-start-3">Confirm</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { CreateConstantInstruction, Instruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { reactive, ref, watch } from 'vue'
import { Type } from '@/model/Type'

const props = defineProps<{
  id: string
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit?: {
    moveInstruction: (instr: Instruction, dir: 'up' | 'down') => void
    removeInstruction: (instr: Instruction) => void
  }
}>()

const instruction = ref<CreateConstantInstruction>(
  props.instruction.instruction as CreateConstantInstruction,
)

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as CreateConstantInstruction
  },
  { immediate: true },
)

function trimAfterSecondUppercase(str: string) {
  const match = str.match(/^([^A-Z]*[A-Z][^A-Z]*)(?=[A-Z])/)
  return match ? match[1] : str
}

const variableForm = reactive<CreateConstantInstruction>({
  name: '',
  type: Type.StringType,
  value: '',
})

watch(
  () => variableForm.type,
  (val) => {
    if (val === Type.BooleanType) {
      variableForm.value = false
    }
  },
  { immediate: true },
)

function variableType() {
  if (variableForm.type === Type.StringType) {
    return { type: 'text', class: 'input' }
  } else if (variableForm.type === Type.DoubleType || variableForm.type === Type.IntType) {
    return { type: 'number', class: 'input' }
  } else if (variableForm.type === Type.ColorType) {
    return { type: 'color', class: '' }
  } else {
    return { type: 'checkbox', class: 'toggle' }
  }
}

function openDialog() {
  variableForm.name = instruction.value.name
  variableForm.type = instruction.value.type
  variableForm.value = instruction.value.value
  const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
  dialog.showModal()
}

function handleConfirm() {
  console.log(variableForm.value)
  instruction.value = {
    name: variableForm.name,
    type: variableForm.type,
    value: variableForm.value,
  }
  closeDialog()
}

function closeDialog() {
  const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
  dialog.close()
}
</script>
