import { defineStore } from "pinia";

export const useErrorPresenterStore = defineStore('error-presenter', {
  state: () => ({
    errorsQueue: [] as object[]
  }),
  getters: {
    errorShown: (state) => state.errorsQueue.length > 0 ? state.errorsQueue[0] : undefined
  },
  actions: {
    showError(err: object) {
      this.errorsQueue.push(err)
    },
    /** This function is expected to be called by the ErrorPresenter component */
    errorWasViewed() {
      this.errorsQueue.shift()
    },
  },
})
