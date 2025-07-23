<script setup lang="ts">
import {
  InstructionType,
  type IfElseInstruction,
  type IfInstruction,
  type Instruction,
  type RealInstruction,
} from '@/model/scripts/Instruction'
import InstructionItem from './InstructionItem.vue'

const props = defineProps<{ instructions: Instruction[] }>()

function isIfInstruction(
  instruction: RealInstruction,
  type: InstructionType,
): instruction is IfInstruction {
  return type === InstructionType.IfInstruction || isIfElseInstruction(instruction, type)
}

function isIfElseInstruction(
  instruction: RealInstruction,
  type: InstructionType,
): instruction is IfElseInstruction {
  return type === InstructionType.IfElseInstruction
}

function removeInstruction(target: Instruction) {
  function recursiveRemove(instructions: Instruction[]): boolean {
    const idx = instructions.indexOf(target)

    if (idx !== -1) {
      instructions.splice(idx, 1)
      return true
    } else {
      for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i].instruction
        const type = instructions[i].type
        if (isIfInstruction(instruction, type)) {
          if (!recursiveRemove(instruction.thenInstructions)) {
            if (isIfElseInstruction(instruction, type)) {
              return recursiveRemove(instruction.elseInstructions)
            }
          } else {
            return true
          }
        }
      }
      return false
    }
  }

  recursiveRemove(props.instructions)
}

function moveInstruction(target: Instruction, dir: 'up' | 'down') {
  function recursiveMove(
    instructions: Instruction[],
    branch: 'root' | 'then' | 'else',
  ): Instruction | undefined {
    const idx = instructions.indexOf(target)

    // === CASE 1: Instruction found in current array ===
    if (idx !== -1) {
      const newIdx = dir === 'up' ? idx - 1 : idx + 1

      if (newIdx >= 0 && newIdx < instructions.length) {
        return handleSwapOrNest(instructions, idx, newIdx)
      } else {
        return handleBoundary(instructions, dir, branch)
      }
    }

    // === CASE 2: Instruction not found, recurse into childrens to find an If or IfElse ===
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i].instruction
      const type = instructions[i].type

      if (isIfInstruction(instruction, type)) {
        let target = recursiveMove(instruction.thenInstructions, 'then')
        if (target !== undefined) {
          handleNestedInsert(instructions, instructions[i], i, target)
          i++ // skip over newly inserted element
          return undefined
        }

        if (isIfElseInstruction(instruction, type)) {
          target = recursiveMove(instruction.elseInstructions, 'else')
          if (target !== undefined) {
            if (dir === 'up') {
              instruction.thenInstructions.push(target) // if moving up from an else block, insert the target instruction at the end of the then block
            } else {
              instructions.splice(i + 1, 0, target)
              i++
            }
            return undefined
          }
        }
      }
    }

    return undefined
  }

  function handleSwapOrNest(instructions: Instruction[], idx: number, newIdx: number): undefined {
    const temp = instructions[idx]
    const newInstr = instructions[newIdx]

    const isDown = dir === 'down'

    if (isIfInstruction(newInstr.instruction, newInstr.type)) {
      if (isDown) {
        newInstr.instruction.thenInstructions.unshift(temp) // add the instr to first elem of then
      } else {
        if (isIfElseInstruction(newInstr.instruction, newInstr.type)) {
          newInstr.instruction.elseInstructions.push(temp) //if going upward, add elem to last elem of else
        } else {
          newInstr.instruction.thenInstructions.push(temp) //if going upward, add elem to last elem of then (IfInstruction but not IfElseInstruction case)
        }
      }
      instructions.splice(idx, 1)
    } else {
      // Simple swap, done inside a block of instructions when not being at borders
      instructions[idx] = newInstr
      instructions[newIdx] = temp
    }

    return undefined
  }

  function handleBoundary(
    instructions: Instruction[],
    dir: 'up' | 'down',
    branch: 'root' | 'then' | 'else',
  ): Instruction | undefined {
    if (branch === 'then' || branch === 'else') {
      // return the first or last elem of the branch based on movement, removing it from the current block
      return dir === 'up' ? instructions.shift() : instructions.pop()
    }
    return undefined
  }

  function handleNestedInsert(
    instructions: Instruction[],
    container: Instruction,
    i: number,
    target: Instruction,
  ) {
    if (dir === 'up') {
      instructions.splice(i, 0, target) // insert before
    } else {
      // moving the block down
      if (isIfElseInstruction(container.instruction, container.type)) {
        container.instruction.elseInstructions.unshift(target) // if the instruction is an if else instruction, insert the instruction at the start of the else branch
      } else {
        instructions.splice(i + 1, 0, target) // insert after
      }
    }
  }

  recursiveMove(props.instructions, 'root')
}
</script>

<template>
  <InstructionItem
    v-for="(instruction, index) in instructions"
    :key="index"
    :instruction="instruction"
    :depth="0"
    :moveInstruction="moveInstruction"
    :removeInstruction="removeInstruction"
  />
</template>
