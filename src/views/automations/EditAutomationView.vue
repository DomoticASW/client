<script setup lang="ts">
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'
import AddButton from '@/components/AddButton.vue'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { AutomationId, type Trigger as AutomationTrigger } from '@/model/scripts/Script'
import { findAutomation } from '@/api/scripts/requests/automations'
import InstructionItems from '@/components/tasks-automations/InstructionItems.vue'
import { useInstructionsStore } from '@/stores/instructions'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import Route from '@/router/index'
import NavbarLayout from '@/components/NavbarLayout.vue'

const props = defineProps<{ id?: string }>()
const userInfo = useUserInfoStore()
const instructionsStore = useInstructionsStore()
const automationName = ref<string>('')
const trigger = ref<AutomationTrigger | undefined>()
const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  if (props.id) {
    try {
      loadingOverlay.startLoading()
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
  } else {
    instructionsStore.instructions = []
  }
})
</script>

<template>
  <NavbarLayout
    :title="props.id ? 'Edit automation' : 'Create automation'"
    :show-back-button="true"
  >
    <div class="mx-6">
      <input
        type="text"
        placeholder="Automation name"
        class="input w-full"
        v-model="automationName"
      />
    </div>
    <hr class="m-4" />
    <h1 class="text-xl">Trigger</h1>
    <Trigger :trigger="trigger" :edit="true" />
    <hr class="m-4" />
    <h1 class="text-xl">Actions</h1>
    <InstructionItem
      v-for="(instruction, index) in instructionsStore.instructions"
      :key="index"
      :instruction="instruction"
      :id="index.toString()"
      :edit="true"
    />
    <div class="pb-4"></div>
    <AddButton>
      <InstructionItems />
    </AddButton>
  </NavbarLayout>
</template>
