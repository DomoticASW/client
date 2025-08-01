<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import AddButton from '@/components/AddButton.vue'
import { createTask, editTask, findTask } from '@/api/scripts/requests/tasks'
import { TaskId } from '@/model/scripts/Script'
import InstructionItems from '@/components/tasks-automations/InstructionItems.vue'
import { useInstructionsStore } from '@/stores/instructions'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import Route from '@/router/index'
import NavbarLayout from '@/components/NavbarLayout.vue'

const props = defineProps<{ id?: string }>()
const userInfo = useUserInfoStore()
const instructionsStore = useInstructionsStore()
const taskName = ref<string>('')
const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  if (props.id) {
    try {
      loadingOverlay.startLoading()
      const task = await findTask(TaskId(props.id), userInfo.token)
      instructionsStore.instructions = task.instructions
      taskName.value = task.name
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
    } else {
      // Create
      await createTask(
        {
          name: taskName.value,
          instructions: instructionsStore.instructions,
        },
        userInfo.token,
      )
      Route.back()
    }
  } finally {
    loadingOverlay.stopLoading()
  }
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
