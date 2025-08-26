<script setup lang="ts">
import Trigger from '@/components/tasks-automations/TriggerComponent.vue'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { AutomationId, type Trigger as AutomationTrigger } from '@/model/scripts/Script'
import {
  createAutomation,
  editAutomation,
  findAutomation,
} from '@/api/scripts/requests/automations'
import InstructionItems from '@/components/tasks-automations/InstructionItems.vue'
import { useInstructionsStore } from '@/stores/instructions'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import Route from '@/router/index'
import NavbarLayout from '@/components/NavbarLayout.vue'
import type { Device } from '@/model/devices-management/Device'
import DeviceActionPropertyDialog from '@/components/tasks-automations/DeviceActionPropertyDialog.vue'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import { useErrorPresenterStore } from '@/stores/error-presenter'
import InfoDialogs from '@/components/tasks-automations/InfoDialogs.vue'

const props = defineProps<{ id?: string }>()
const userInfo = useUserInfoStore()
const instructionsStore = useInstructionsStore()
const automationName = ref<string>('')
const trigger = ref<AutomationTrigger | undefined>()
const loadingOverlay = useLoadingOverlayStore()
const selectedDevice = ref<Device | undefined>(undefined)
const successPresenter = useSuccessPresenterStore()
const errorPresenter = useErrorPresenterStore()

onMounted(async () => {
  if (props.id) {
    try {
      loadingOverlay.startLoading()
      const automation = await findAutomation(AutomationId(props.id), userInfo.token)
      instructionsStore.instructions = automation.instructions
      automationName.value = automation.name
      trigger.value = automation.trigger
    } catch (err) {
      if (typeof err == 'object' && err) {
        errorPresenter.showError(err, Route.back)
      }
    } finally {
      loadingOverlay.stopLoading()
    }
  } else {
    instructionsStore.instructions = []
  }
})

async function changeAutomation() {
  try {
    loadingOverlay.startLoading()
    if (props.id) {
      // Edit
      await editAutomation(
        AutomationId(props.id),
        {
          name: automationName.value,
          trigger: trigger.value!,
          instructions: instructionsStore.instructions,
        },
        userInfo.token,
      )
      showToastMessage('The changes of the ' + automationName.value + ' automation have been saved')
    } else {
      // Create
      await createAutomation(
        {
          name: automationName.value,
          trigger: trigger.value!,
          instructions: instructionsStore.instructions,
        },
        userInfo.token,
      )
      showToastMessage('The ' + automationName.value + ' automation has been created')
      Route.back()
    }
  } finally {
    loadingOverlay.stopLoading()
  }
}

function updateTrigger(newTrigger?: AutomationTrigger) {
  trigger.value = newTrigger
}

function openDialog(device: Device) {
  selectedDevice.value = device
  const dialog = document.getElementById('device_action_property') as HTMLDialogElement
  dialog.showModal()
}

function closeDialog() {
  const dialog = document.getElementById('device_action_property') as HTMLDialogElement
  dialog.close()
}

function showToastMessage(msg: string) {
  successPresenter.showSuccess(presentSuccess(msg, '', 3000))
}
</script>

<template>
  <NavbarLayout
    :title="props.id ? 'Edit automation' : 'Create automation'"
    :show-back-button="true"
  >
    <template #actions>
      <button type="button" class="btn btn-ghost text-base" @click="changeAutomation()">
        Save
      </button>
    </template>
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
    <Trigger :trigger="trigger" @trigger="updateTrigger" :edit="true" />
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
    <InstructionItems :openDialog="openDialog" :closeDialog="closeDialog" />
    <DeviceActionPropertyDialog :selected-device="selectedDevice" :close-dialog="closeDialog" />
    <InfoDialogs/>
  </NavbarLayout>
</template>
