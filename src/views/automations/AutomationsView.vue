<script setup lang="ts">
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

  const automations = [
    Automation("Washing machine done", true),
    Automation("Turn off lights when high sun brightness", false),
  ]
</script>

<template>
  <ul class="list rounded-box">
    <li class="list-row" v-for="automation in automations" :key="automation.name">
      <div class="list-col-grow flex items-center">
        <div>{{ automation.name }}</div>
      </div>
      <div class="flex items-center">
        <input type="checkbox" :v-model="automation.checked" class="toggle toggle-sm" :aria-label="'Change ' + automation.name + ' status'"/>
      </div>
    </li>
  </ul>

  <div class="px-4 pb-4 fixed bottom-0 w-[inherit]">
    <div class="flex justify-end px-5">
      <button class="btn btn-circle" type="button" aria-label="Create new automation">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-[1.2em]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style></style>
