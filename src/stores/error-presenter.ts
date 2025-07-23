import { defineStore } from "pinia";

export const useErrorPresenterStore = defineStore('error-presenter', {
  state: () => ({
    errorsQueue: [] as object[],
    lastShownError: undefined as object | undefined
  }),
  getters: {
    errorShown: (state) => state.errorsQueue.length > 0 ? state.errorsQueue[0] : undefined
  },
  actions: {
    showError(err: object) {
      if (!this.errorShown) {
        this.lastShownError = err
      }
      this.errorsQueue.push(err)
    },
    stopShowingError() {
      const dequeuedError = this.errorsQueue.shift()
      if (dequeuedError) {
        this.lastShownError = dequeuedError
      }
    },
  },
})
