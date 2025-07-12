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
          name: 'users-permissions',
          children: [
            { path: '', component: () => import('../views/admin/users-permissions/UsersPermissionsView.vue'), },
            { path: ':id', component: () => import('../views/admin/users-permissions/UserPermissionsView.vue'), },
          ]
        },
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

export default router
