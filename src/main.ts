import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserInfoStore } from './stores/user-info'
import { useErrorPresenterStore } from './stores/error-presenter'
import { useNotificationsStore } from './stores/notifications'
import { useGroupsStore } from './stores/groups'
import { useLoadingOverlayStore } from './stores/loading-overlay'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useLoadingOverlayStore()
// Loading a session token if it exists
const userInfo = useUserInfoStore()

// Subscribing for notifications
useNotificationsStore()

const errorPresenterStore = useErrorPresenterStore()
app.config.errorHandler = (err) => {
  if (typeof err == "object" && err != undefined) {
    if ('__brand' in err && err.__brand === 'InvalidTokenError') {
      // If the token expires or is not valid, take the user to login page
      errorPresenterStore.showError({
        message: 'The session has expired, please login again to continue',
        __brand: 'SessionExpired'
      }, () => {
        useUserInfoStore().clearUserInfo()
        router.push("/login")
      })
    } else {
      errorPresenterStore.showError(err)
    }
  }
}

userInfo.$subscribe(async () => {
  useGroupsStore().updateGroups()
})

useGroupsStore().updateGroups()

app.mount('#app')
