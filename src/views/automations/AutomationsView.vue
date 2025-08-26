<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { useUserInfoStore } from '@/stores/user-info'
import type { Automation } from '@/model/scripts/Script'
import { getAllAutomations, toggleAutomation } from '@/api/scripts/requests/automations'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import NavbarLayout from '@/components/NavbarLayout.vue'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import ListSkeleton from '@/components/ListSkeleton.vue'

const userInfo = useUserInfoStore()

const automations = ref<Automation[]>()
const loadingOverlay = useLoadingOverlayStore()

onMounted(async () => {
  try {
    loadingOverlay.startLoading()
    automations.value = await getAllAutomations(userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
})

async function toggle(automation: Automation) {
  try {
    loadingOverlay.startLoading()
    await toggleAutomation(automation.id, automation.enabled, userInfo.token)
    useSuccessPresenterStore().showSuccess(
      presentSuccess(
        'The ' +
          automation.name +
          ' automation has been ' +
          (automation.enabled ? 'enabled' : 'disabled'),
        '',
        3000,
      ),
    )
  } finally {
    loadingOverlay.stopLoading()
  }
}
</script>

<template>
  <NavbarLayout title="Automations">
    <div
      v-if="automations?.length === 0"
      class="flex text-center text-gray-500 justify-center items-center min-h-[50vh]"
    >
      <p class="text-2xl">No automation yet...</p>
    </div>
    <ul class="list rounded-box" v-if="automations">
      <RouterLink
        v-for="automation in automations"
        :key="automation.name"
        :to="{ name: 'automation', params: { id: automation.id } }"
      >
        <li class="list-row hover:bg-primary/20">
          <span class="fa-solid fa-robot text-2xl self-center"></span>
          <div class="list-col-grow flex items-center">
            <div>{{ automation.name }}</div>
          </div>
          <div class="flex items-center">
            <input
              type="checkbox"
              v-model="automation.enabled"
              class="toggle toggle-sm"
              :aria-label="'Change ' + automation.name + ' status'"
              @click.stop
              @change="toggle(automation)"
            />
          </div>
        </li>
      </RouterLink>
    </ul>
    <ListSkeleton v-else/>

    <AddButton name="add-automation" />
  </NavbarLayout>
</template>

<style></style>
