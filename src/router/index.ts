import { Role } from '@/model/users-management/User'
import { useUserInfoStore } from '@/stores/user-info'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'devices' },
    },
    {
      path: '/devices',
      children: [
        { path: '', name: 'devices', component: () => import('../views/devices/DevicesView.vue') },
        { path: ':id', name: 'device', component: () => import('../views/devices/DeviceView.vue'), props: true }
      ]
    },
    {
      path: '/admin',
      beforeEnter: () => {
        const userInfo = useUserInfoStore()
        if (userInfo.role !== Role.Admin) {
          return {
            name: "devices"
          }
        }
      },
      children: [
        {
          path: 'manage-users',
          name: 'manage-users',
          component: () => import('../views/admin/ManageUsersView.vue'),
        },
        {
          path: 'users-permissions',
          children: [
            {
              path: '',
              name: 'manage-users-permissions',
              component: () => import('../views/admin/users-permissions/UsersPermissionsView.vue'),
            },
            {
              path: ':id',
              name: 'user-permissions',
              component: () => import('../views/admin/users-permissions/UserPermissionsView.vue'),
            },
          ],
        },
        {
          path: 'manage-devices',
          children: [
            {
              path: '',
              name: 'manage-devices',
              component: () => import('../views/admin/manage-devices/ManageDevicesView.vue'),
            },
            {
              path: 'add-device',
              name: 'add-device',
              component: () => import('../views/admin/manage-devices/AddDeviceView.vue'),
            },
          ],
        },
        {
          path: 'device-groups',
          children: [
            { path: '', name: 'device-groups', component: () => import('../views/admin/device-groups/DeviceGroupsView.vue') },
            { path: ':id', name: 'device-group', component: () => import('../views/admin/device-groups/DeviceGroupView.vue'), props: true },
          ]
        },
        {
          path: 'automations-task-permissions',
          children: [
            {
              path: '',
              name: 'automations-and-tasks-permissions',
              component: () =>
                import(
                  '../views/admin/automations-task-permissions/AutomationsAndTasksPermissionsView.vue'
                ),
            },
            {
              path: ':id',
              name: 'automation-and-task-permission',
              component: () =>
                import(
                  '../views/admin/automations-task-permissions/AutomationAndTaskPermissionsView.vue'
                ),
            },
          ],
        },
      ],
    },
    {
      path: '/tasks',
      children: [
        {
          path: '',
          name: 'tasks',
          component: () => import('../views/tasks/TasksView.vue'),
        },
        {
          path: 'add-task',
          name: 'add-task',
          component: () => import('../views/tasks/EditTaskView.vue'),
        },
        {
          path: ':id',
          children: [
            {
              path: '',
              name: 'task',
              component: () => import('../views/tasks/TaskView.vue'),
              props: true,
            },
            {
              path: 'edit',
              name: 'edit-task',
              component: () => import('../views/tasks/EditTaskView.vue'),
              props: true,
            },
          ],
        },
      ],
    },
    {
      path: '/automations',
      children: [
        {
          path: '',
          name: 'automations',
          component: () => import('../views/automations/AutomationsView.vue'),
        },
        {
          path: 'add-automation',
          name: 'add-automation',
          component: () => import('../views/automations/EditAutomationView.vue'),
        },
        {
          path: ':id',
          children: [
            {
              path: '',
              name: 'automation',
              component: () => import('../views/automations/AutomationView.vue'),
              props: true,
            },
            {
              path: 'edit',
              name: 'edit-automation',
              component: () => import('../views/automations/EditAutomationView.vue'),
              props: true,
            },
          ],
        },
      ],
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/SigninView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/notifications/NotificationsView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const userInfo = useUserInfoStore()
  if (userInfo.token) {
    if (to.name === "login" || to.name === "signin") {
      return {
        name: 'devices'
      }
    }
  } else {
    if (to.name !== 'login' && to.name !== 'signin') {
      return {
        name: 'login'
      }
    }
  }
})

export default router
