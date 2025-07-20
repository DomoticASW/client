<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserInfoStore } from '@/stores/user-info'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import { authorizedRequest, type ServerError } from '@/utils'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DeviceGroup } from '@/model/devices-management/DeviceGroup'
const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const groups = ref<DeviceGroup[] | undefined>(undefined)
authorizedRequest('/api/deviceGroups', userInfo.token)
  .then(({ json }) => (groups.value = json as DeviceGroup[]))
  // TODO: present error to the user
  .catch((e) => console.log(e))

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
async function saveEditingGroup() {
  const id = groupEditing.value
  const newName = groupEditingName.value
  if (groups.value && id && newName != undefined) {
    try {
      loadingOverlay.startLoading()
      await authorizedRequest(`/api/deviceGroups/${id}`, userInfo.token, {
        method: 'POST',
        body: JSON.stringify({ name: newName }),
      })
      const group = groups.value.find((g) => g.id === id)
      if (group) {
        group.name = newName
      }
    } catch (e) {
      // TODO: present error to the user
      console.log((e as ServerError).message)
    } finally {
      cancelEditingGroup()
      loadingOverlay.stopLoading()
    }
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
