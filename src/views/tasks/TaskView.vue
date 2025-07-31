<script setup lang="ts">
import { findTask } from '@/api/scripts/requests/tasks'
import InstructionItem from '@/components/tasks-automations/InstructionItem.vue'
import { TaskId } from '@/model/scripts/Script'
import { useInstructionsStore } from '@/stores/instructions'
import { useUserInfoStore } from '@/stores/user-info'
import { onMounted, ref } from 'vue'
import Route from '@/router/index.ts'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'

const props = defineProps<{ id: string }>()
const userInfo = useUserInfoStore()

const instructionsStore = useInstructionsStore()
const loadingOverlay = useLoadingOverlayStore()

const taskName = ref<string>('')

onMounted(async () => {
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
})
</script>

<template>
  <InstructionItem
    v-for="(instruction, index) in instructionsStore.instructions"
    :key="index"
    :instruction="instruction"
    :id="index.toString()"
    :edit="false"
  />
  <div class="pb-4"></div>
</template>
