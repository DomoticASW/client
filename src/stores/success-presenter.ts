import { defineStore } from "pinia"

const DEFAULT_CLOSING_ANIMATION_MS = 2000

export const useSuccessPresenterStore = defineStore('success-presenter', {
  state: () => ({
    successQueue: [] as object[]
  }),
  getters: {
    successShown: (state) => state.successQueue.length > 0 ? state.successQueue[0] : undefined
  },
  actions: {
    showSuccess(succ: object) {
      this.successQueue.push(succ)
    },
    /** This function is expected to be called by the SuccessPresenter component */
    successWasViewed() {
      this.successQueue.shift()
    },
  },
})


export function presentSuccess(title: string, msg: string = "", text: string = "", duration: number = DEFAULT_CLOSING_ANIMATION_MS) {
  return {title: title, message: msg, text: text, duration: duration}
}
