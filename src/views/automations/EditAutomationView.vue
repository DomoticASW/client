<script setup lang="ts">
import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'

import { authorizedRequest, deserializeBody } from '@/api/api'
import { automationDeserializer } from '@/api/scripts/GetAutomationDTO'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const automationName = ref<string>('')

onMounted(async () => {
  if (route.params.id != undefined) {
    const res = await authorizedRequest('/api/automations/' + route.params.id, userInfo.token)
    const automation = await deserializeBody(res, automationDeserializer)
    instructions.value = automation.instructions
    automationName.value = automation.name
  }
})
</script>

<template>
  <div class="mx-6">
    <input type="text" placeholder="Automation name" class="input w-full" :value="automationName" />
  </div>
  <hr class="m-4" />
  <h1 class="text-xl">Trigger</h1>
  <Trigger :edit="true" />
  <hr class="m-4" />
  <h1 class="text-xl">Actions</h1>
  <InstructionReorder :instructions="instructions" />
  <div class="pb-4"></div>
</template>
