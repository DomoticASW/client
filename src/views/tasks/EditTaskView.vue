<script setup lang="ts">
import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import AddButton from '@/components/AddButton.vue'
import { findTask } from '@/api/scripts/requests/tasks'
import { TaskId } from '@/model/scripts/Script'
import InstructionItems from '@/components/tasks-automations/InstructionItems.vue'

const props = defineProps<{ id?: string }>()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const taskName = ref<string>('')

onMounted(async () => {
  if (props.id) {
    const task = await findTask(TaskId(props.id), userInfo.token)
    instructions.value = task.instructions
    taskName.value = task.name
  }
})
</script>

<template>
  <div class="mx-6">
    <input type="text" placeholder="Task name" class="input w-full" :value="taskName" />
  </div>
  <hr class="m-4" />
  <InstructionReorder :instructions="instructions" />
  <div class="pb-4"></div>
  <AddButton :modal="true">
    <InstructionItems />
  </AddButton>
</template>
