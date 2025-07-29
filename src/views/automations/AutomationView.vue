<script setup lang="ts">
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { AutomationId, type Trigger as AutomationTrigger } from '@/model/scripts/Script'
import { findAutomation } from '@/api/scripts/requests/automations'

const props = defineProps<{id: string}>()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const automationName = ref<string>('')
const trigger = ref<AutomationTrigger>()

onMounted(async () => {
  const automation = await findAutomation(AutomationId(props.id), userInfo.token)
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
