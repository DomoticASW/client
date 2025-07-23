<script setup lang="ts">
import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
import { authorizedRequest, deserializeBody } from '@/api/api'
import { taskDeserializer } from '@/api/scripts/GetTaskDTO'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const taskName = ref<string>('')

onMounted(async () => {
  if (route.params.id != undefined) {
    const res = await authorizedRequest('/api/tasks/' + route.params.id, userInfo.token)
    const task = await deserializeBody(res, taskDeserializer)
    instructions.value = task.instructions
    taskName.value = task.name
  }
})
</script>

<template>
  <div class="mx-6">
    <input
      type="text"
      placeholder="Task name"
      class="input w-full"
      :value="taskName"
    />
  </div>
  <hr class="m-4" />
  <InstructionReorder :instructions="instructions" />
  <div class="pb-4"></div>
</template>
