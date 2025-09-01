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
    automations.value = await getAllAutomations(userInfo.token)
  } finally {
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
    <ListSkeleton v-else />

    <AddButton name="add-automation" />

    <template #actions>
      <button
        class="fa-circle-info fa-solid fa-xl btn btn-ghost btn-circle"
        onclick="automations_info.showModal()"
      ></button>
    </template>

    <dialog id="automations_info" class="modal modal-sm">
      <div class="modal-box max-w-sm">
        <h2 class="card-title mb-2">Automations info</h2>
        <p>
          Automations are a sequence of instruction that, when executed, can execute actions on
          devices and read properties from them.
        </p>
        <ul class="list-disc list-inside">
          <li>
            <span class="font-bold">Execution</span>: When enabled, an automation is executed
            automatically based on a trigger. Can be disabled from the toggle next to it.
            <ul class="list-disc list-inside ml-4">
              <li>
                <span class="font-bold">Device event trigger</span>: Execute the automation if a
                device fires a specified event.
              </li>
              <li>
                <span class="font-bold">Period trigger</span>: Execute the automation every time a
                specified amount of time passes from a specified starting date.
              </li>
            </ul>
          </li>
          <li>
            <span class="font-bold">Creation</span>: An automation can be created by everyone, but
            they need to have permissions on the devices used (just for the device actions).
          </li>
        </ul>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>Ok</button>
      </form>
    </dialog>
  </NavbarLayout>
</template>

<style></style>
