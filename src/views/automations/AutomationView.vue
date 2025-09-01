<script setup lang="ts">
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { AutomationId, type Trigger as AutomationTrigger } from '@/model/scripts/Script'
import { deleteAutomation, findAutomation } from '@/api/scripts/requests/automations'
import { useInstructionsStore } from '@/stores/instructions'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import Route from '@/router/index'
import NavbarLayout from '@/components/NavbarLayout.vue'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import { useErrorPresenterStore } from '@/stores/error-presenter'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()
const instructionsStore = useInstructionsStore()
const automationName = ref<string>('')
const automationId = ref<AutomationId>()
const trigger = ref<AutomationTrigger>()
const loadingOverlay = useLoadingOverlayStore()
const errorPresenter = useErrorPresenterStore()

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    const automation = await findAutomation(AutomationId(props.id), userInfo.token)
    instructionsStore.instructions = automation.instructions
    automationName.value = automation.name
    automationId.value = automation.id
    trigger.value = automation.trigger
  } catch (err) {
    if (typeof err == 'object' && err) {
      errorPresenter.showError(err, Route.back)
    }
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function removeAutomation() {
  try {
    loadingOverlay.startLoading()
    await deleteAutomation(automationId.value!, userInfo.token)
    useSuccessPresenterStore().showSuccess(
      presentSuccess('The ' + automationName.value + ' automation has been deleted', '', 3000)
    )
    Route.back()
  } finally {
    loadingOverlay.stopLoading()
  }
}
</script>

<template>
  <NavbarLayout :title="automationName" :show-back-button="true">
    <template #actions>
      <RouterLink
        :to="{ name: 'edit-automation', params: { id: automationId } }"
        class="btn btn-ghost text-base"
        >Edit</RouterLink
      >
      <button class="btn btn-ghost text-error text-base" @click="removeAutomation()">Delete</button>
    </template>
    <h1 class="text-xl">Trigger</h1>
    <Trigger :trigger="trigger" :edit="false" />
    <hr class="m-4" />
    <h1 class="text-xl">Instructions</h1>
    <div
      v-if="instructionsStore.instructions.length === 0"
      class="flex text-center text-gray-500 justify-center items-center min-h-[50vh]"
    >
      <p class="text-2xl">No instructions yet...</p>
    </div>
    <InstructionItem
      v-for="(instruction, index) in instructionsStore.instructions"
      :key="index"
      :instruction="instruction"
      :id="index.toString()"
      :edit="false"
    />
    <div class="pb-4"></div>
  </NavbarLayout>
</template>
