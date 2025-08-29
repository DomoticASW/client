<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import { createTask, editTask, findTask } from '@/api/scripts/requests/tasks'
import { TaskId } from '@/model/scripts/Script'
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
import { useDevicesStore } from '@/stores/devices'
import { useUsersStore } from '@/stores/users'
import { useTasksStore } from '@/stores/tasks'

const props = defineProps<{ id?: string }>()
const userInfo = useUserInfoStore()
const instructionsStore = useInstructionsStore()
const taskName = ref<string>('')
const loadingOverlay = useLoadingOverlayStore()
const selectedDevice = ref<Device | undefined>(undefined)
const successPresenter = useSuccessPresenterStore()
const errorPresenter = useErrorPresenterStore()

onMounted(async () => {
  if (props.id) {
    try {
      loadingOverlay.startLoading()
      await useDevicesStore().updateDevices()
      await useUsersStore().updateUsers()
      await useTasksStore().updateTasks()
      const task = await findTask(TaskId(props.id), userInfo.token)
      instructionsStore.instructions = task.instructions
      taskName.value = task.name
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

async function changeTask() {
  try {
    loadingOverlay.startLoading()
    if (props.id) {
      // Edit
      await editTask(
        TaskId(props.id),
        {
          name: taskName.value,
          instructions: instructionsStore.instructions,
        },
        userInfo.token,
      )
      showToastMessage('The changes of the ' + taskName.value + ' task have been saved')
    } else {
      // Create
      await createTask(
        {
          name: taskName.value,
          instructions: instructionsStore.instructions,
        },
        userInfo.token,
      )
      showToastMessage('The ' + taskName.value + ' task has been created')
      Route.back()
    }
  } finally {
    loadingOverlay.stopLoading()
  }
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
  <NavbarLayout :title="props.id ? 'Edit task' : 'Create task'" :show-back-button="true">
    <template #actions>
      <button type="button" class="btn btn-ghost text-base" @click="changeTask()">Save</button>
    </template>
    <div class="mx-6">
      <input type="text" placeholder="Task name" class="input w-full" v-model="taskName" />
    </div>
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
      :edit="true"
    />
    <div class="pb-4"></div>
    <InstructionItems :openDialog="openDialog" :closeDialog="closeDialog" />
    <DeviceActionPropertyDialog :selected-device="selectedDevice" :close-dialog="closeDialog" />
    <InfoDialogs />
  </NavbarLayout>
</template>
