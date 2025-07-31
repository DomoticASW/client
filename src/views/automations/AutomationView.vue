<script setup lang="ts">
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { AutomationId, type Trigger as AutomationTrigger } from '@/model/scripts/Script'
import { findAutomation } from '@/api/scripts/requests/automations'
import { useInstructionsStore } from '@/stores/instructions'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import Route from '@/router/index'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()
const instructionsStore = useInstructionsStore()
const automationName = ref<string>('')
const trigger = ref<AutomationTrigger>()
const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  try {
    const automation = await findAutomation(AutomationId(props.id), userInfo.token)
    instructionsStore.instructions = automation.instructions
    automationName.value = automation.name
    trigger.value = automation.trigger
  } catch (err: unknown) {
    if (typeof err == 'object' && err != undefined) {
      if (err && '__brand' in err) {
        if (err.__brand === 'ScriptNotFoundError') {
          Route.back()
        }
      }
      throw err
    }
  } finally {
    loadingOverlay.stopLoading()
  }
})
</script>

<template>
  <h1 class="text-xl">Trigger</h1>
  <Trigger :trigger="trigger" :edit="false" />
  <hr class="m-4" />
  <h1 class="text-xl">Actions</h1>
  <InstructionItem
    v-for="(instruction, index) in instructionsStore.instructions"
    :key="index"
    :instruction="instruction"
    :id="index.toString()"
    :edit="false"
  />
  <div class="pb-4"></div>
</template>
