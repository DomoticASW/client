<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserInfoStore } from '@/stores/user-info'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DeviceGroup, DeviceGroupId } from '@/model/devices-management/DeviceGroup'
import type { ServerError } from '@/api/ServerError'
import * as api from '@/api/devices-management/requests/device-groups'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const groups = ref<DeviceGroup[] | undefined>(undefined)

/* Group creation */
const groupCreatingName = ref<string | undefined>(undefined)
const createGroupModalId = 'create_group_modal'
const createGroupModal = () => document.getElementById(createGroupModalId) as HTMLDialogElement
function cancelCreatingGroup() {
  groupCreatingName.value = undefined
  createGroupModal().close()
}
async function saveCreatingGroup() {
  const name = groupCreatingName.value
  if (name) {
    try {
      loadingOverlay.startLoading()
      const id = await api.createDeviceGroup(name, userInfo.token)
      const group = await api.findDeviceGroup(id, userInfo.token)
      groups.value?.push(group)
    } catch (e) {
      // TODO: present error to the user
      console.log((e as ServerError).message)
    } finally {
      cancelCreatingGroup()
      loadingOverlay.stopLoading()
    }
  }
}

/* Group editing */
const groupEditing = ref<DeviceGroupId | undefined>(undefined)
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
      await api.renameDeviceGroup(id, newName, userInfo.token)
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

onMounted(async () => {
  try {
    groups.value = await api.getAllDeviceGroups(userInfo.token)
  } catch (e) {
    // TODO: present error to the user
    console.log(e)
  }
})
</script>

<template>
  <div>
    <div class="navbar justify-between">
      <h1 class="text-2xl">Device groups</h1>
      <button
        class="btn btn-ghost fa-solid fa-plus fa-lg"
        @click="createGroupModal().showModal()"
      ></button>
      <!-- Dialog for creating a new group -->
      <dialog :id="createGroupModalId" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Create a new group</h3>
          <input type="text" placeholder="Group name" class="input" v-model="groupCreatingName" />
          <div class="modal-action">
            <button class="btn btn-primary" v-on:click="saveCreatingGroup()">Save</button>
            <button class="btn btn-primary btn-soft" v-on:click="cancelCreatingGroup()">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
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
