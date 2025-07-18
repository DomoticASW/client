import { defineStore } from "pinia";

export const useLoadingOverlayStore = defineStore('loading-overlay', {
  state: () => ({
    tasksLoading: 0
  }),
  getters: {
    isLoading: (state) => state.tasksLoading > 0
  },
  actions: {
    startLoading() {
      this.tasksLoading += 1
    },
    stopLoading() {
      this.tasksLoading -= 1
    },
  },
})
