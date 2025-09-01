import { defineStore } from 'pinia'

const DEFAULT_CLOSING_ANIMATION_MS = 2000
export interface SuccessPresenterInterface {
  title: string
  msg: string
  duration: number
}

export const useSuccessPresenterStore = defineStore('success-presenter', {
  state: () => ({
    successQueue: [] as SuccessPresenterInterface[],
  }),
  getters: {
    successShown: (state) => (state.successQueue.length > 0 ? state.successQueue[0] : undefined),
  },
  actions: {
    showSuccess(succ: SuccessPresenterInterface) {
      this.successQueue.push(succ)
      setTimeout(() => {
        this.successWasViewed()
      }, succ.duration)
    },
    /** This function is expected to be called by the SuccessPresenter component */
    successWasViewed() {
      this.successQueue.shift()
    },
  },
})

export function presentSuccess(
  title: string,
  msg: string = '',
  duration: number = DEFAULT_CLOSING_ANIMATION_MS
) {
  return { title: title, msg: msg, duration: duration } as SuccessPresenterInterface
}
