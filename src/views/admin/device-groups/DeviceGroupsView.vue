<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
import { authorizedRequest } from '@/utils'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const userInfo = useUserInfoStore()
const groups = ref<{ id: string; name: string }[] | undefined>(undefined)
authorizedRequest('/api/deviceGroups', userInfo.token).then(({ json }) => {
  groups.value = json as { id: string; name: string }[]
})

const groupEditing = ref<string | undefined>(undefined)
const groupEditingName = ref<string | undefined>(undefined)

const editGroupModalId = 'edit_group_name_modal'
const editGroupNameModal = () => document.getElementById(editGroupModalId) as HTMLDialogElement
function startEditingGroup(id: string) {
  const group = groups.value?.find((g) => g.id == id)
  if (group) {
    groupEditing.value = group.id
    groupEditingName.value = group.name
    editGroupNameModal().showModal()
  }
}
function cancelEditingGroup() {
  groupEditing.value = undefined
  groupEditingName.value = undefined
  editGroupNameModal().close()
}
function saveEditingGroup() {
  if (groups.value) {
    groups.value.find((g) => g.id === groupEditing.value!)!.name = groupEditingName.value!
    cancelEditingGroup()
  }
}
</script>

<template>
  <div>
    <div class="navbar justify-between">
      <h1 class="text-2xl">Device groups</h1>
    </div>
    <ul v-if="groups" class="list">
      <RouterLink
        v-for="g in groups"
        v-bind:key="g.id"
        :to="{ name: 'device-group', params: { id: g.id } }"
      >
        <li class="list-row">
          <span class="fa-solid fa-sitemap text-2xl self-center"></span>
          {{ g.name }}
          <button
            class="btn btn-ghost fa-solid fa-pen"
            @click.prevent="startEditingGroup(g.id)"
          ></button>
          <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
        </li>
      </RouterLink>
    </ul>
    <DeviceListSkeleton v-else />

    <!-- Dialog for changing a group name -->
    <dialog :id="editGroupModalId" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Change the group name</h3>
        <input type="text" placeholder="Group name" class="input" v-model="groupEditingName" />
        <div class="modal-action">
          <button class="btn btn-primary" v-on:click="saveEditingGroup()">Save</button>
          <button class="btn btn-primary btn-soft" v-on:click="cancelEditingGroup()">Cancel</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style></style>
