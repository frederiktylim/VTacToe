const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function boardWinner(squares) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  if (squares.every(Boolean)) return 'draw'
  return null
}

// Standard minimax — mutates `squares` in place with backtracking (caller must pass a copy)
function minimax(squares, isMaximizing, depth) {
  const winner = boardWinner(squares)
  if (winner === 'O') return 10 - depth
  if (winner === 'X') return depth - 10
  if (winner === 'draw') return 0

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O'
        best = Math.max(best, minimax(squares, false, depth + 1))
        squares[i] = null
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'X'
        best = Math.min(best, minimax(squares, true, depth + 1))
        squares[i] = null
      }
    }
    return best
  }
}

function pickBest(scoredMoves) {
  if (scoredMoves.length === 0) return null
  const max = Math.max(...scoredMoves.map(m => m.val))
  const top = scoredMoves.filter(m => m.val === max)
  return top[Math.floor(Math.random() * top.length)]
}

// Best cell index for the computer (O) on a single 3×3 board.
// Returns -1 if the board has no available moves.
export function bestSingleBoardMove(squares) {
  const board = [...squares]
  const scored = []
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O'
      scored.push({ i, val: minimax(board, false, 0) })
      board[i] = null
    }
  }
  const best = pickBest(scored)
  return best ? best.i : -1
}

// Best (boardIdx, cellIdx) for the computer (O) across multiple boards.
// allowedIndices: the board indices the computer is permitted to play on.
// Returns null if no moves are available.
export function bestMultiBoardMove(boards, boardResults, allowedIndices) {
  const scored = []
  for (const boardIdx of allowedIndices) {
    if (boardResults[boardIdx]) continue
    const board = [...boards[boardIdx]]
    for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
      if (!board[cellIdx]) {
        board[cellIdx] = 'O'
        scored.push({ boardIdx, cellIdx, val: minimax(board, false, 0) })
        board[cellIdx] = null
      }
    }
  }
  return pickBest(scored)
}
