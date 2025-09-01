<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserInfoStore } from '@/stores/user-info'
import DeviceListSkeleton from '@/components/admin/manage-devices/DeviceListSkeleton.vue'
import { DeviceGroupId, type DeviceGroup } from '@/model/devices-management/DeviceGroup'
import type { Device } from '@/model/devices-management/Device'
import { getAllDeviceGroups } from '@/api/devices-management/requests/device-groups'
import { getAllDevices } from '@/api/devices-management/requests/devices'
import NavbarLayout from '@/components/NavbarLayout.vue'
import router from '@/router'
import DeviceGroupsButton from '@/components/DeviceGroupsButton.vue'

const userInfo = useUserInfoStore()
const groups = ref<DeviceGroup[] | undefined>(undefined)
const selectedGroupId = ref<DeviceGroupId | undefined>(getGroupQueryParam())
const devices = ref<Device[] | undefined>(undefined)
const dropdown = useTemplateRef('devices-selected-group-dropdown')

const devicesToShow = computed(() => selectedGroup.value?.devices ?? devices.value)
const selectedGroup = computed(() => groups.value?.find((g) => g.id == selectedGroupId.value))

function getGroupQueryParam() {
  const rawValue = router.currentRoute.value.query.group
  if (typeof rawValue == 'string') {
    return DeviceGroupId(rawValue)
  } else {
    return undefined
  }
}

function selectGroup(id?: DeviceGroupId) {
  selectedGroupId.value = id
  router.replace({
    query: {
      ...router.currentRoute.value.query,
      group: id,
    },
  })
  closeDropdown()
}
function closeDropdown() {
  dropdown.value!.removeAttribute('open')
}

onMounted(async () => {
  groups.value = await getAllDeviceGroups(userInfo.token)
})
onMounted(async () => {
  devices.value = await getAllDevices(userInfo.token)
})
</script>

<template>
  <NavbarLayout title="Devices">
    <details ref="devices-selected-group-dropdown" v-if="groups" class="dropdown">
      <summary class="btn btn-primary mb-2 min-w-32 flex justify-between">
        {{ selectedGroup?.name ?? 'All devices' }}
        <span class="fa-solid fa-caret-down ps-4"></span>
      </summary>
      <div class="fixed size-full inset-0 z-999" @click.stop="closeDropdown"></div>
      <ul
        class="menu dropdown-content rounded-box w-52 p-2 bg-base-100 border border-primary gap-1"
      >
        <li v-for="g in groups" v-bind:key="g.id">
          <a @click="selectGroup(g.id)" :class="{ 'menu-active': g.id == selectedGroup?.id }">
            {{ g.name }}
          </a>
        </li>
        <li>
          <a @click="selectGroup(undefined)" :class="{ 'menu-active': !selectedGroup }">
            All devices
          </a>
        </li>
      </ul>
    </details>
    <div v-else class="skeleton h-8 w-32"></div>

    <ul v-if="devicesToShow" class="list">
      <div v-for="d in devicesToShow" v-bind:key="d.id">
        <RouterLink :to="{ name: 'device', params: { id: d.id } }">
          <li class="list-row hover:bg-primary/20">
            <span class="fa-solid fa-microchip text-2xl self-center"></span>
            <div>
              {{ d.name }}
              <br />
              <DeviceGroupsButton :id="d.id" :device="d" />
            </div>
            <span class="fa-solid fa-chevron-right opacity-30 self-center"></span>
          </li>
        </RouterLink>
      </div>
    </ul>
    <DeviceListSkeleton v-else />
    <div
      v-if="devicesToShow && devicesToShow.length === 0"
      class="flex text-center text-gray-500 justify-center items-center min-h-[30vh]"
    >
      <p v-if="devices && devices.length == 0" class="text-2xl">
        The admin has not yet registered any device to the system...
      </p>
      <p v-else class="text-2xl">
        This group is currently empty, only the admin can add devices to it...
      </p>
    </div>
  </NavbarLayout>
</template>

<style></style>
