import type { Automation, Task } from '@/model/scripts/Script'
import { defineStore } from 'pinia'

export const useScript = defineStore('script', {
  state: () => ({
    script: {} as Task | Automation,
  }),
  getters: {
    id: (state) => state.script.id,
    name: (state) => state.script.name,
    instructions: (state) => state.script.instructions,
  },
  actions: {},
})
