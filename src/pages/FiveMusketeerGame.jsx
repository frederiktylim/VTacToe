import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../components/Board'
import GameOverModal from '../components/GameOverModal'
import './FiveMusketeerGame.css'

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkBoard(squares) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  if (squares.every(Boolean)) return { winner: 'draw', line: null }
  return null
}

function overallResult(results) {
  const xWins = results.filter(r => r?.winner === 'X').length
  const oWins = results.filter(r => r?.winner === 'O').length
  if (xWins >= 3) return 'X'
  if (oWins >= 3) return 'O'
  if (results.every(r => r !== null)) {
    const xPoints = results.reduce((s, r) => s + (r.winner === 'X' ? 1 : r.winner === 'draw' ? 0.5 : 0), 0)
    const oPoints = results.reduce((s, r) => s + (r.winner === 'O' ? 1 : r.winner === 'draw' ? 0.5 : 0), 0)
    if (xPoints > oPoints) return 'X'
    if (oPoints > xPoints) return 'O'
    return 'draw'
  }
  return null
}

const EMPTY_BOARDS = () => Array.from({ length: 5 }, () => Array(9).fill(null))

export default function FiveMusketeerGame() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState(EMPTY_BOARDS)
  const [boardResults, setBoardResults] = useState(Array(5).fill(null))
  const [current, setCurrent] = useState('X')
  const [gameResult, setGameResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  function handlePlay(boardIdx, cellIdx) {
    if (gameResult) return
    if (boardResults[boardIdx]) return
    if (boards[boardIdx][cellIdx]) return

    const newBoards = boards.map((b, i) =>
      i === boardIdx ? b.map((v, j) => (j === cellIdx ? current : v)) : b
    )
    const newResult = checkBoard(newBoards[boardIdx])
    const newBoardResults = boardResults.map((r, i) =>
      i === boardIdx ? (newResult ?? r) : r
    )

    setBoards(newBoards)
    setBoardResults(newBoardResults)

    const overall = overallResult(newBoardResults)
    if (overall !== null) {
      setGameResult(overall)
      setShowModal(true)
    } else {
      setCurrent(c => (c === 'X' ? 'O' : 'X'))
    }
  }

  function handleReset() {
    setBoards(EMPTY_BOARDS())
    setBoardResults(Array(5).fill(null))
    setCurrent('X')
    setGameResult(null)
    setShowModal(false)
  }

  const boardLabel = r => {
    if (!r) return null
    return r.winner === 'draw' ? 'Draw' : `${r.winner} wins`
  }

  const statusText = gameResult
    ? gameResult === 'draw' ? "It's a draw!" : `${gameResult} wins the match!`
    : `${current}'s turn`

  const renderBoardWrap = (i) => (
    <div key={i} className={`fm-board-wrap${boardResults[i] ? ' decided' : ''}`}>
      <div className="board-container">
        <Board
          squares={boards[i]}
          winLine={boardResults[i]?.line ?? null}
          onPlay={cellIdx => handlePlay(i, cellIdx)}
          className="board--fm"
        />
        {boardResults[i] && (
          <div className={`board-overlay overlay-${boardResults[i].winner}`}>
            {boardResults[i].winner === 'X' && (
              <span className="overlay-symbol overlay-x">X</span>
            )}
            {boardResults[i].winner === 'O' && (
              <span className="overlay-symbol overlay-o">O</span>
            )}
            {boardResults[i].winner === 'draw' && (
              <div className="overlay-minus" />
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="fm-game">
      <h1 className="fm-title">Five Musketeers</h1>
      <p className={`fm-status${gameResult && gameResult !== 'draw' ? ' winner' : ''}`}>
        {statusText}
      </p>

      <div className="fm-boards">
        <div className="fm-row">{[0, 1, 2].map(renderBoardWrap)}</div>
        <div className="fm-row">{[3, 4].map(renderBoardWrap)}</div>
      </div>

      <div className="fm-controls">
        <button className="reset-btn" onClick={handleReset}>New Game</button>
        <button className="back-btn" onClick={() => navigate('/')}>Menu</button>
      </div>

      {showModal && (
        <GameOverModal
          winner={gameResult}
          onPlayAgain={handleReset}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
