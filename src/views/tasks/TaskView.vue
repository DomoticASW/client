<script setup lang="ts">
import { findTask } from '@/api/scripts/requests/tasks'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { TaskId } from '@/model/scripts/Script'
import { useInstructionsStore } from '@/stores/instructions'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()

const instructionsStore = useInstructionsStore()

const taskName = ref<string>('')

onMounted(async () => {
  const task = await findTask(TaskId(props.id), userInfo.token)
  instructionsStore.instructions = task.instructions
  taskName.value = task.name
})
</script>

<template>
  <InstructionItem
    v-for="(instruction, index) in instructionsStore.instructions"
    :key="index"
    :instruction="instruction"
    :id="index.toString()"
    :edit="false"
  />
  <div class="pb-4"></div>
</template>
