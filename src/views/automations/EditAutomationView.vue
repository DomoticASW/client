<script setup lang="ts">
import InstructionReorder from '@/components/tasks-automations/InstructionReorder.vue'
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'
import AddButton from '@/components/AddButton.vue'
import type { Instruction } from '@/model/scripts/Instruction'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { AutomationId, type Trigger as AutomationTrigger } from '@/model/scripts/Script'
import { findAutomation } from '@/api/scripts/requests/automations'

const props = defineProps<{ id?: string }>()
const userInfo = useUserInfoStore()

const instructions = ref<Instruction[]>([])
const automationName = ref<string>('')
const trigger = ref<AutomationTrigger | undefined>()

onMounted(async () => {
  if (props.id) {
    const automation = await findAutomation(AutomationId(props.id), userInfo.token)
    instructions.value = automation.instructions
    automationName.value = automation.name
    trigger.value = automation.trigger
  }
})
</script>

<template>
  <div class="mx-6">
    <input type="text" placeholder="Automation name" class="input w-full" :value="automationName" />
  </div>
  <hr class="m-4" />
  <h1 class="text-xl">Trigger</h1>
  <Trigger :trigger="trigger" :edit="true" />
  <hr class="m-4" />
  <h1 class="text-xl">Actions</h1>
  <InstructionReorder :instructions="instructions" />
  <div class="pb-4"></div>
  <AddButton :modal="true"> </AddButton>
</template>
