<script setup lang="ts">
  import { ref } from 'vue';
  import AddButton from '@/components/AddButton.vue'

  interface Automation {
    id: string,
    name: string,
    checked: boolean
  }

  function Automation(id: string, name: string, checked: boolean): Automation {
    return {
      id,
      name,
      checked
    }
  }

  const automations = ref([
    Automation("1", "Washing machine done", true),
    Automation("2", "Turn off lights when high sun brightness", false),
  ])
</script>

<template>
  <ul class="list rounded-box">
    <RouterLink v-for="automation in automations" :key="automation.name" :to="{ name: 'automation', params: { id: automation.id }}">
      <li class="list-row">
        <div class="list-col-grow flex items-center">
          <div>{{ automation.name }}</div>
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="automation.checked" class="toggle toggle-sm" :aria-label="'Change ' + automation.name + ' status'"/>
        </div>
      </li>
    </RouterLink>
  </ul>

  <AddButton name="add-automation"></AddButton>
</template>

<style></style>
