<script setup lang="ts">
  import { ref } from 'vue';

  import AddButton from '@/components/AddButton.vue'
  interface Automation {
    name: string,
    checked: boolean
  }

  function Automation(name: string, checked: boolean): Automation {
    return {
      name,
      checked
    }
  }

  const automations = ref([
    Automation("Washing machine done", true),
    Automation("Turn off lights when high sun brightness", false),
  ])
</script>

<template>
  <ul class="list rounded-box">
    <li class="list-row" v-for="automation in automations" :key="automation.name">
      <div class="list-col-grow flex items-center">
        <div>{{ automation.name }}</div>
      </div>
      <div class="flex items-center">
        <input type="checkbox" v-model="automation.checked" class="toggle toggle-sm" :aria-label="'Change ' + automation.name + ' status'"/>
      </div>
    </li>
  </ul>

  <AddButton name="add-automation"></AddButton>
</template>

<style></style>
