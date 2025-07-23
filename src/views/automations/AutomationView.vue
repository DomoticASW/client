<script setup lang="ts">
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'

import { authorizedRequest, deserializeBody } from '@/api/api'
import { automationDeserializer } from '@/api/scripts/GetAutomationDTO'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Trigger as AutomationTrigger } from '@/model/scripts/Script'

const route = useRoute()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const automationName = ref<string>('')
const trigger = ref<AutomationTrigger>()

onMounted(async () => {
  const res = await authorizedRequest('/api/automations/' + route.params.id, userInfo.token)
  const automation = await deserializeBody(res, automationDeserializer)
  instructions.value = automation.instructions
  automationName.value = automation.name
  trigger.value = automation.trigger
})
</script>

<template>
  <h1 class="text-xl">Trigger</h1>
  <Trigger :trigger="trigger" :edit="false" />
  <hr class="m-4" />
  <h1 class="text-xl">Actions</h1>
  <InstructionItem
    v-for="[key, instruction] in instructions.entries()"
    :key="key"
    :instruction="instruction"
  />
  <div class="pb-4"></div>
</template>
