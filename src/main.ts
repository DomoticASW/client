import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserInfoStore } from './stores/user-info'
import { isGetUserInfoDTO } from '@/api/users-management/dtos/GetUserInfoDTO'
import { useErrorPresenterStore } from './stores/error-presenter'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Loading a session token if it exists
useUserInfoStore()

const errorPresenterStore = useErrorPresenterStore()
app.config.errorHandler = (err) => {
  if (typeof err == "object" && err != undefined) {
    errorPresenterStore.showError(err)
  }
}

// During development it's possible to set a VITE_USER_INFO object to skip login:
// VITE_USER_INFO='{"email": "a@email.com", "nickname": "Foo", "token": "blablabla", "role": "Admin" }' npm run dev
const userInfoStr = import.meta.env.VITE_USER_INFO
if (import.meta.env.DEV && userInfoStr) {
  try {
    const userInfo = JSON.parse(userInfoStr)
    if (!isGetUserInfoDTO(userInfo)) {
      throw new Error()
    } else {
      const userInfoStore = useUserInfoStore()
      userInfoStore.userInfo = userInfo
    }
  } catch (e) {
    throw new Error("Value of VITE_USER_INFO is not valid.\n" + (e as Error).message)
  }
}

app.mount('#app')
