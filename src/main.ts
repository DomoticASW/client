import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { isUserInfo, useUserInfoStore } from './stores/user-info'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// During development it's possible to set a VITE_USER_INFO object to skip login:
// VITE_USER_INFO='{"email": "email.com", "nickname": "sos", "token": "sus"}' npm run dev
const userInfoStr = import.meta.env.VITE_USER_INFO
if (import.meta.env.DEV && userInfoStr) {
  try {
    const userInfo = JSON.parse(userInfoStr)
    if (!isUserInfo(userInfo)) {
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
