<template>
  <InstructionLayout :colors="colors" :edit="edit" :instruction="props.instruction">
    <p class="truncate">Send notification to</p>
    <p v-if="!edit" class="font-bold text-center truncate">{{ selectedUser?.nickname }}</p>
    <label :for="'email_' + id" class="hidden" v-if="edit">User</label>
    <select
      v-model="instruction.email"
      v-if="edit"
      class="select text-center truncate h-7 select-primary"
      :name="'email_' + id"
      :id="'email_' + id"
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

    <label class="label mb-2 text-secondary-content col-span-2" :for="'message_' + id"
      >Message sent</label
    >
    <div class="row-start-3 col-span-full">
      <textarea
        placeholder="Message sent"
        class="w-full textarea textarea-primary border-primary!"
        :disabled="!edit"
        v-model="instruction.message"
        :name="'message_' + id"
        :id="'message_' + id"
      />
    </div>
  </InstructionLayout>
</template>

<script setup lang="ts">
import type { Instruction, SendNotificationInstruction } from '@/model/scripts/Instruction'
import InstructionLayout from './InstructionLayout.vue'
import { onMounted, ref, watch } from 'vue'
import type { User } from '@/model/users-management/User'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{
  id: string
  instruction: Instruction
  colors: string
  edit: boolean
}>()

const instruction = ref(props.instruction.instruction as SendNotificationInstruction)
const users = ref<User[]>()
const selectedUser = ref<User>()
const usersStore = useUsersStore()

onMounted(() => {
  users.value = usersStore.users
  selectedUser.value = usersStore.getUser(instruction.value.email)
})

watch(
  () => props.instruction,
  (val) => {
    instruction.value = val.instruction as SendNotificationInstruction
    selectedUser.value = users.value?.find((u) => u.email === instruction.value.email)
  },
  { immediate: true }
)
</script>
