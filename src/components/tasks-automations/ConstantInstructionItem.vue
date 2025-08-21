<template>
  <InstructionLayout
    :colors="colors"
    :edit="edit"
    :instruction="props.instruction"
    @click="openDialog"
    :class="edit ? 'cursor-pointer transition-all duration-100 hover:bg-primary/10' : ''"
  >
    <p>Constant</p>
    <p class="font-bold truncate text-center">{{ instruction.name }}</p>

    <template v-if="instruction.type !== Type.ColorType">
      <p class="col-start-2 truncate text-center">
        {{ instruction.value }}
      </p>
    </template>
    <template v-else>
      <input
        class="col-start-2 place-self-center cursor-pointer transition-all"
        type="color"
        @click.prevent="openDialog"
        :value="instruction.value"
      />
    </template>
  </InstructionLayout>

  <dialog :id="id" class="modal">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mx-2 mb-2">Set constant</h3>
      <form @submit.prevent="handleConfirm">
        <label for="name" class="fieldset-legend text-sm mx-3 mt-2">Name</label>
        <input
          name="name"
          id="name"
          type="text"
          class="input mt-2 mx-2"
          placeholder="Name"
          v-model="variableForm.name"
        />

        <label for="type" class="fieldset-legend text-sm mx-3">Types</label>
        <select name="type" id="type" v-model="variableForm.type" class="select mt-2 mx-2">
          <option selected disabled>Pick a Type</option>
          <option
            v-for="type in Object.values(Type).filter((type) => type !== Type.VoidType)"
            :value="type"
            :key="type"
          >
            {{ trimAfterSecondUppercase(type) }}
          </option>
        </select>

        <label for="value" class="fieldset-legend text-sm mx-3">Value</label>
        <input
          v-if="variableType().type === 'number'"
          :type="variableType().type"
          :class="['mt-2 mx-2', variableType().class]"
          :step="variableForm.type === Type.DoubleType ? 'any' : '1'"
          v-model="variableForm.value"
          name="value"
          id="value"
        />
        <input
          v-else-if="variableType().type === 'color'"
          :type="variableType().type"
          :class="['mt-2 mx-2', variableType().class]"
          v-model="variableForm.value"
          name="value"
          id="value"
        />
        <input
          v-else-if="variableType().type === 'text'"
          :type="variableType().type"
          :class="['mt-2 mx-2', variableType().class]"
          v-model="variableForm.value"
          name="value"
          id="value"
        />
        <input
          v-else-if="variableType().type === 'checkbox'"
          :type="variableType().type"
          :class="['mt-2 mx-2', variableType().class]"
          v-model="variableForm.value"
          name="value"
          id="value"
        />
        <div class="modal-action grid grid-cols-3 w-full">
          <button type="button" class="btn col-start-1" @click="closeDialog">
            Close
          </button>
          <button type="submit" class="btn col-start-3 btn-primary">Confirm</button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import {
  InstructionType,
  type CreateConstantInstruction,
  type Instruction,
} from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { ref, watch } from 'vue'
import { Type } from '@/model/Type'
import { useInstructionsStore } from '@/stores/instructions'

const props = defineProps<{
  id: string
  instruction: Instruction
  colors: string
  edit: boolean
}>()

const instructionsStore = useInstructionsStore()

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

const variableForm = ref<CreateConstantInstruction>({
  name: instruction.value.name,
  type: instruction.value.type,
  value: instruction.value.value,
})

watch(
  () => variableForm.value.type,
  (val) => {
    if (val === Type.BooleanType) {
      variableForm.value.value = false
    } else if (val === Type.IntType || val == Type.DoubleType) {
      variableForm.value.value = 0
    } else if (val === Type.ColorType) {
      variableForm.value.value = '#000000'
    } else if (val === Type.StringType) {
      variableForm.value.value = ''
    }
  },
  { immediate: true },
)

function variableType() {
  if (variableForm.value.type === Type.StringType) {
    return { type: 'text', class: 'input' }
  } else if (
    variableForm.value.type === Type.DoubleType ||
    variableForm.value.type === Type.IntType
  ) {
    return { type: 'number', class: 'input' }
  } else if (variableForm.value.type === Type.ColorType) {
    return { type: 'color', class: '' }
  } else {
    return { type: 'checkbox', class: 'toggle' }
  }
}

function openDialog() {
  if (props.edit) {
    variableForm.value.name = instruction.value.name
    variableForm.value.type = instruction.value.type
    variableForm.value.value = instruction.value.value
    const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
    dialog.showModal()
  }
}

function handleConfirm() {
  instructionsStore.changeInstruction(props.instruction, {
    type: InstructionType.CreateConstantInstruction,
    instruction: {
      name: variableForm.value.name,
      type: variableForm.value.type,
      value: variableForm.value.value,
    },
  })
  closeDialog()
}

function closeDialog() {
  const dialog = document.getElementById(props.id.toString()) as HTMLDialogElement
  dialog.close()
}
</script>
