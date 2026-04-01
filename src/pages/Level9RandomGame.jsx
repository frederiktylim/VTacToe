import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../components/Board'
import GameOverModal from '../components/GameOverModal'
import './Level9Game.css'

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
  if (xWins >= 5) return 'X'
  if (oWins >= 5) return 'O'
  if (results.every(r => r !== null)) {
    const xPoints = results.reduce((s, r) => s + (r.winner === 'X' ? 1 : r.winner === 'draw' ? 0.5 : 0), 0)
    const oPoints = results.reduce((s, r) => s + (r.winner === 'O' ? 1 : r.winner === 'draw' ? 0.5 : 0), 0)
    if (xPoints > oPoints) return 'X'
    if (oPoints > xPoints) return 'O'
    return 'draw'
  }
  return null
}

function pickRandomBoard(boardResults) {
  const available = boardResults
    .map((r, i) => (r === null ? i : null))
    .filter(i => i !== null)
  if (available.length === 0) return null
  return available[Math.floor(Math.random() * available.length)]
}

const EMPTY_BOARDS = () => Array.from({ length: 9 }, () => Array(9).fill(null))

export default function Level9RandomGame() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState(EMPTY_BOARDS)
  const [boardResults, setBoardResults] = useState(Array(9).fill(null))
  const [current, setCurrent] = useState('X')
  const [gameResult, setGameResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeBoard, setActiveBoard] = useState(() => pickRandomBoard(Array(9).fill(null)))

  function handlePlay(boardIdx, cellIdx) {
    if (gameResult) return
    if (boardIdx !== activeBoard) return
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
      setActiveBoard(pickRandomBoard(newBoardResults))
      setCurrent(c => (c === 'X' ? 'O' : 'X'))
    }
  }

  function handleReset() {
    const emptyResults = Array(9).fill(null)
    setBoards(EMPTY_BOARDS())
    setBoardResults(emptyResults)
    setCurrent('X')
    setGameResult(null)
    setShowModal(false)
    setActiveBoard(pickRandomBoard(emptyResults))
  }

  const statusText = gameResult
    ? gameResult === 'draw' ? "It's a draw!" : `${gameResult} wins the match!`
    : `${current}'s turn`

  const renderBoardWrap = (i) => {
    const isActive = i === activeBoard && !gameResult
    const isFinished = !!boardResults[i]
    const isDimmed = !isActive && !isFinished && !gameResult

    let wrapClass = 'l9-board-wrap'
    if (isActive) wrapClass += ' board-random-active'
    if (isDimmed) wrapClass += ' board-random-dim'

    return (
      <div key={i} className={wrapClass}>
        <div className="board-container">
          <Board
            squares={boards[i]}
            winLine={boardResults[i]?.line ?? null}
            onPlay={cellIdx => handlePlay(i, cellIdx)}
            className="board--l9"
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
  }

  return (
    <div className="l9-game">
      <h1 className="l9-title">9 Random</h1>
      <p className={`l9-status${gameResult && gameResult !== 'draw' ? ' winner' : ''}`}>
        {statusText}
      </p>

      <div className="l9-boards">
        {Array.from({ length: 9 }, (_, i) => renderBoardWrap(i))}
      </div>

      <div className="l9-controls">
        <button className="reset-btn" onClick={handleReset}>New Game</button>
        <button className="back-btn" onClick={() => navigate('/level-9')}>Menu</button>
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
