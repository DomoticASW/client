<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { useUserInfoStore } from '@/stores/user-info'
import type { Automation } from '@/model/scripts/Script'
import { getAllAutomations, toggleAutomation } from '@/api/scripts/requests/automations'

const userInfo = useUserInfoStore()

const automations = ref<Automation[]>()

onMounted(async () => {
  automations.value = await getAllAutomations(userInfo.token)
})

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
            @change="toggleAutomation(automation.id, automation.enabled, userInfo.token)"
          />
        </div>
      </li>
    </RouterLink>
  </ul>

  <AddButton name="add-automation" />
</template>

<style></style>
