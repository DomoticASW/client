<script setup lang="ts">
import { authorizedRequest, deserializeBody } from '@/api/api'
import { taskDeserializer } from '@/api/scripts/GetTaskDTO'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const taskName = ref<string>('')

onMounted(async () => {
  const res = await authorizedRequest('/api/tasks/' + route.params.id, userInfo.token)
  const task = await deserializeBody(res, taskDeserializer)
  instructions.value = task.instructions
  taskName.value = task.name
})
</script>

<template>
  <InstructionItem
    v-for="[index, instruction] in instructions.entries()"
    :key="index"
    :instruction="instruction"
  />
  <div class="pb-4"></div>
</template>
