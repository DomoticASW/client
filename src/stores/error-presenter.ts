import Router from "@/router/index";
import { defineStore } from "pinia";
import { useUserInfoStore } from "./user-info";

export const useErrorPresenterStore = defineStore('error-presenter', {
  state: () => ({
    errorsQueue: [] as object[],
    callbackAfterOkQueue: [] as ((() => void) | undefined)[],
  }),
  getters: {
    errorShown: (state) => state.errorsQueue.length > 0 ? state.errorsQueue[0] : undefined
  },
  actions: {
    /**
     * @param err error to show in a dialog
     * @param afterOk callback to be called after clicking the Ok button of the error dialog, optional
     */
    showError(err: object, afterOk?: () => void) {
      if ('__brand' in err && err.__brand === 'InvalidTokenError') {
        // If the token expires or is not valid, take the user to login page
        this.errorsQueue.push({
          message: 'The session has expired, please login again to continue',
          __brand: 'SessionExpired'
        })
        this.callbackAfterOkQueue.push(() => {
          useUserInfoStore().clearUserInfo()
          Router.push("/login")
        })
      } else {
        this.errorsQueue.push(err)
        this.callbackAfterOkQueue.push(afterOk)
      }
    },
    /** This function is expected to be called by the ErrorPresenter component
     *  and after removing the error from the queue it will call the callback put in the showError method
    */
    errorWasViewed() {
      this.errorsQueue.shift()
      const callback = this.callbackAfterOkQueue.shift()
      if (callback) {
        callback()
      }
    },
  },
})
