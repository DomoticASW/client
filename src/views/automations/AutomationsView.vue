<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { authorizedRequest } from '@/utils'
import { useUserInfoStore } from '@/stores/user-info'

const userInfo = useUserInfoStore()

const automations = ref<{ id: string; name: string; enabled: boolean }[] | undefined>(undefined)

authorizedRequest('/api/automations', userInfo.token).then(({ json }) => {
  automations.value = json as { id: string; name: string; enabled: boolean }[]
})

function toggleAutomation(automation: { id: string; name: string; enabled: boolean }) {
  authorizedRequest('/api/automations/' + automation.id, userInfo.token, {
    method: 'POST',
    body: JSON.stringify({
      enable: automation.enabled,
    }),
  })
}
</script>

<template>
  <ul class="list rounded-box">
    <RouterLink
      v-for="automation in automations"
      :key="automation.name"
      :to="{ name: 'automation', params: { id: automation.id } }"
    >
      <li class="list-row">
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
            @change="toggleAutomation(automation)"
          />
        </div>
      </li>
    </RouterLink>
  </ul>

  <AddButton name="add-automation"></AddButton>
</template>

<style></style>
