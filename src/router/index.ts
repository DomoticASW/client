import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin',
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
              name: 'users-permissions',
              component: () => import('../views/admin/users-permissions/UsersPermissionsView.vue'),
            },
            {
              path: ':id',
              name: 'user-permission',
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
            {
              path: '',
              name: 'device-groups',
              component: () => import('../views/admin/device-groups/DeviceGroupsView.vue'),
            },
            {
              path: ':id',
              name: 'device-group',
              component: () => import('../views/admin/device-groups/DeviceGroupView.vue'),
            },
          ],
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
              name: "task",
              component: () => import('../views/tasks/TaskView.vue'),
            },
            {
              path: 'edit',
              name: "edit-task",
              component: () => import('../views/tasks/EditTaskView.vue'),
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
            },
            {
              path: 'edit',
              name: 'edit-automation',
              component: () => import('../views/automations/EditAutomationView.vue'),
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
  ],
})

export default router
