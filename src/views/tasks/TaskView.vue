<script setup lang="ts">
import { findTask } from '@/api/scripts/requests/tasks'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import type { Instruction } from '@/model/scripts/Instruction'
import { TaskId } from '@/model/scripts/Script'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const taskName = ref<string>('')

onMounted(async () => {
  const task = await findTask(TaskId(props.id), userInfo.token)
  instructions.value = task.instructions
  taskName.value = task.name
})
</script>

<template>
  <InstructionItem
    v-for="[index, instruction] in instructions.entries()"
    :key="index"
    :instruction="instruction"
    :id="index.toString()"
  />
  <div class="pb-4"></div>
</template>
