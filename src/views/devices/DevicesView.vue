<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserInfoStore } from '@/stores/user-info'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import type { DeviceGroup, DeviceGroupId } from '@/model/devices-management/DeviceGroup'
import type { Device } from '@/model/devices-management/Device'
import { getAllDeviceGroups } from '@/api/devices-management/requests/device-groups'
import { getAllDevices } from '@/api/devices-management/requests/devices'
import { useLoadingOverlayStore } from '@/stores/loading-overlay'
import NavbarLayout from '@/components/NavbarLayout.vue'

const userInfo = useUserInfoStore()
const loadingOverlay = useLoadingOverlayStore()
const groups = ref<DeviceGroup[] | undefined>(undefined)
const selectedGroup = ref<DeviceGroup | undefined>(undefined)
const devices = ref<Device[] | undefined>(undefined)
const dropdown = useTemplateRef('devices-selected-group-dropdown')

const devicesNotInGroup = computed(() =>
  devices.value?.filter((d) =>
    groups.value ? !groups.value.some((g) => g.devices.some((gd) => gd.id == d.id)) : undefined,
  ),
)
const devicesToShow = computed(() => selectedGroup.value?.devices ?? devicesNotInGroup.value)

function selectGroup(id?: DeviceGroupId) {
  selectedGroup.value = id ? groups.value?.find((g) => g.id == id) : undefined
  closeDropdown()
}
function closeDropdown() {
  dropdown.value!.removeAttribute('open')
}

onMounted(async () => {
  loadingOverlay.startLoading()
  try {
    groups.value = await getAllDeviceGroups(userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
  selectedGroup.value = groups.value[0]
})
onMounted(async () => {
  loadingOverlay.startLoading()
  try {
    devices.value = await getAllDevices(userInfo.token)
  } finally {
    loadingOverlay.stopLoading()
  }
})
</script>

<template>
  <NavbarLayout title="Devices">
    <details ref="devices-selected-group-dropdown" v-if="groups" class="dropdown">
      <summary class="btn btn-primary mb-2">
        {{ selectedGroup?.name ?? 'Not in a group' }}
        <span class="fa-solid fa-caret-down ps-4"></span>
      </summary>
      <div class="fixed size-full inset-0 z-999" @click.stop="closeDropdown"></div>
      <ul
        class="menu dropdown-content rounded-box w-52 p-2 bg-base-100 border border-primary-content/30"
      >
        <li v-for="g in groups" v-bind:key="g.id">
          <a @click="selectGroup(g.id)" :class="{ 'menu-active': g.id == selectedGroup?.id }">
            {{ g.name }}
          </a>
        </li>
        <li>
          <a @click="selectGroup(undefined)" :class="{ 'menu-active': !selectedGroup }">
            Not in a group
          </a>
        </li>
      </ul>
    </details>
    <div v-else class="skeleton h-8 w-32"></div>

    <ul v-if="devicesToShow" class="list">
      <RouterLink
        v-for="d in devicesToShow"
        v-bind:key="d.id"
        :to="{ name: 'device', params: { id: d.id } }"
      >
        <li class="list-row">
          <span class="fa-solid fa-microchip text-2xl self-center"></span>
          {{ d.name }}
          <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
        </li>
      </RouterLink>
    </ul>
    <DeviceListSkeleton v-else />
  </NavbarLayout>
</template>

<style></style>
