import type { Instruction } from "./Instruction"

export interface Task {
  id: string
  name: string
  instructions: Instruction[]
}
