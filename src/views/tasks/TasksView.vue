<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AddButton from '@/components/AddButton.vue'
import { authorizedRequest } from '@/utils'
import { useUserInfoStore } from '@/stores/user-info'

const userInfo = useUserInfoStore()

const tasks = ref<{id: string, name: string}[] | undefined>(undefined)

authorizedRequest('/api/tasks', userInfo.token).then(({json}) => {
  tasks.value = json as {id: string, name: string}[]
  //console.log(json)
})
.catch(e => console.log(e))

</script>

<template>
  <ul class="list rounded-box" v-if="tasks">
    <RouterLink
      v-for="task in tasks"
      :key="task.id"
      :to="{ name: 'task', params: { id: task.id } }"
    >
      <li class="list-row">
        <div class="list-col-grow flex items-center">
          {{ task.name }}
        </div>
        <a
          type="button"
          class="btn btn-circle btn-ghost fa-solid fa-play fa-lg !flex"
          :aria-label="'Start task: ' + task"
        ></a>
      </li>
    </RouterLink>
  </ul>

  <AddButton name="add-task">ss</AddButton>
</template>

<style></style>
