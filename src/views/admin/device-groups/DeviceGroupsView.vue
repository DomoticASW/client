<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserInfoStore } from '@/stores/user-info'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DeviceGroup, DeviceGroupId } from '@/model/devices-management/DeviceGroup'
import * as api from '@/api/devices-management/requests/device-groups'
import { useErrorPresenterStore } from '@/stores/error-presenter'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'
import NavbarLayout from '@/components/NavbarLayout.vue'
import AddButton from '@/components/AddButton.vue'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const errorPresenter = useErrorPresenterStore()
const successPresenter = useSuccessPresenterStore()
const groups = ref<DeviceGroup[] | undefined>(undefined)

/* Group creation */
const groupCreatingName = ref<string | undefined>(undefined)
const createGroupModal = useTemplateRef('create-group-modal')
async function saveCreatingGroup() {
  const name = groupCreatingName.value
  createGroupModal.value!.close()
  if (name) {
    try {
      loadingOverlay.startLoading()
      const id = await api.createDeviceGroup(name, userInfo.token)
      const group = await api.findDeviceGroup(id, userInfo.token)
      groups.value?.push(group)
      groupCreatingName.value = undefined
      successPresenter.showSuccess(presentSuccess(`Group ${name} created!`))
    } catch (e) {
      if (typeof e == 'object' && e != null)
        errorPresenter.showError(e, () => createGroupModal.value!.showModal())
    } finally {
      loadingOverlay.stopLoading()
    }
  }
}

/* Group editing */
const groupEditing = ref<DeviceGroupId | undefined>(undefined)
const groupEditingName = ref<string | undefined>(undefined)

const editGroupNameModal = useTemplateRef('edit-group-name-modal')
function startEditingGroup(id: string) {
  const group = groups.value?.find((g) => g.id == id)
  if (group) {
    groupEditing.value = group.id
    groupEditingName.value = group.name
    editGroupNameModal.value!.showModal()
  }
}
async function saveEditingGroup() {
  const id = groupEditing.value
  const newName = groupEditingName.value
  editGroupNameModal.value!.close()
  if (groups.value && id && newName != undefined) {
    try {
      loadingOverlay.startLoading()
      await api.renameDeviceGroup(id, newName, userInfo.token)
      const group = groups.value.find((g) => g.id === id)
      if (group) {
        group.name = newName
        successPresenter.showSuccess(presentSuccess(`Group renamed!`))
      }
    } catch (e) {
      if (typeof e == 'object' && e != null)
        errorPresenter.showError(e, () => editGroupNameModal.value!.showModal())
    } finally {
      loadingOverlay.stopLoading()
    }
  }
}

onMounted(async () => {
  groups.value = await api.getAllDeviceGroups(userInfo.token)
})
</script>

<template>
  <NavbarLayout title="Device groups">
    <ul v-if="groups" class="list">
      <RouterLink
        v-for="g in groups"
        v-bind:key="g.id"
        :to="{ name: 'device-group', params: { id: g.id } }"
      >
        <li class="list-row hover:bg-primary/20">
          <span class="fa-solid fa-sitemap text-2xl self-center"></span>
          {{ g.name }}
          <button
            class="btn btn-circle btn-ghost fa-solid fa-pen"
            @click.prevent="startEditingGroup(g.id)"
          ></button>
          <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
        </li>
      </RouterLink>
    </ul>
    <DeviceListSkeleton v-else />
    <AddButton @onclick="createGroupModal?.showModal()" />
  </NavbarLayout>

  <!-- Dialog for creating a new group -->
  <dialog ref="create-group-modal" class="modal modal-middle">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mb-2 mx-auto justify-center">Create a new group</h3>
      <input
        type="text"
        placeholder="Group name"
        class="input w-full"
        v-model="groupCreatingName"
      />
      <div class="modal-action">
        <button
          class="btn btn-primary"
          :disabled="(groupCreatingName ?? '').trim().length === 0"
          v-on:click="saveCreatingGroup()"
        >
          Save
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="createGroupModal!.close()">Cancel</button>
    </form>
  </dialog>

  <!-- Dialog for changing a group name -->
  <dialog ref="edit-group-name-modal" class="modal modal-middle">
    <div class="modal-box max-w-sm">
      <h3 class="card-title mb-2 mx-auto justify-center">Change the group name</h3>
      <input type="text" placeholder="Group name" class="input w-full" v-model="groupEditingName" />
      <div class="modal-action">
        <button
          class="btn btn-primary"
          :disabled="(groupEditingName ?? '').trim().length === 0"
          v-on:click="saveEditingGroup()"
        >
          Save
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="editGroupNameModal!.close()">Cancel</button>
    </form>
  </dialog>
</template>

<style></style>
