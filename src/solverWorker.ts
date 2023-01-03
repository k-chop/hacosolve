/// <reference lib="webworker" />

import { Solver } from "./Solver"

export type WorkerParams = {
  board: number[]
  width: number
}

export type WorkerResult = {
  type: "result"
  solved: boolean
  message: string
  solution: number[]
}

const solver = new Solver()

self.addEventListener("message", (event) => {
  const { board, width } = event.data as WorkerParams

  solver.solve(board, width)

  const solved = solver.solution != null

  let message = ""
  if (!solved) {
    if (solver.message !== "") {
      message = solver.message
    } else {
      message = "Cannot solve..."
    }
  }
  self.postMessage({
    type: "result",
    solved,
    message,
    solution: solver.solution,
  })
})
