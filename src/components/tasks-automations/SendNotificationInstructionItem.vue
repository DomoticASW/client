<template>
  <InstructionLayout
    :colors="colors"
    :indent="indent"
    :edit="edit"
    :instruction="props.instruction"
  >
    <p class="truncate">Send notification to</p>
    <p v-if="!edit" class="font-bold text-center truncate">{{ selectedUser?.nickname }}</p>
    <select
      v-model="instruction.email"
      v-else
      class="select text-center truncate h-7 select-primary"
    >
      <!-- Show all the users -->
      <option
        v-for="user in users"
        :key="user.email"
        :value="user.email"
        :selected="instruction.email === user.email"
      >
        {{ user.nickname }}
      </option>
    </select>

    <label class="label mb-2 text-secondary-content col-span-2">Message sent</label>
    <div class="row-start-3 col-span-full">
      <textarea
        placeholder="Message sent"
        class="w-full textarea textarea-primary border-primary!"
        :disabled="!edit"
        v-model="instruction.message"
      />
    </div>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, SendNotificationInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import type { User } from '@/model/users-management/User'
import { getAllUsers } from '@/api/users-management/requests/users'
import { useUserInfoStore } from '@/stores/user-info'

const props = defineProps<{
  instruction: Instruction
  indent: string
  depth: number
  colors: string
  edit: boolean
}>()

const userInfo = useUserInfoStore()
const instruction = ref(props.instruction.instruction as SendNotificationInstruction)
const users = ref<User[]>()
const selectedUser = ref<User>()

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as SendNotificationInstruction
  },
  { immediate: true },
)

onMounted(async () => {
  users.value = await getAllUsers(userInfo.token)
  selectedUser.value = users.value?.find((u) => u.email === instruction.value.email)
})
</script>
