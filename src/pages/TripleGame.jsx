import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../components/Board'
import GameOverModal from '../components/GameOverModal'
import ToggleSwitch from '../components/ToggleSwitch'
import { bestMultiBoardMove } from '../utils/ai'
import './TripleGame.css'

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
  if (results.some(r => r === null)) return null
  const xWins = results.filter(r => r.winner === 'X').length
  const oWins = results.filter(r => r.winner === 'O').length
  if (xWins >= 2) return 'X'
  if (oWins >= 2) return 'O'
  const xPoints = results.reduce((s, r) => s + (r.winner === 'X' ? 1 : r.winner === 'draw' ? 0.5 : 0), 0)
  const oPoints = results.reduce((s, r) => s + (r.winner === 'O' ? 1 : r.winner === 'draw' ? 0.5 : 0), 0)
  if (xPoints > oPoints) return 'X'
  if (oPoints > xPoints) return 'O'
  return 'draw'
}

const EMPTY_BOARDS = () => [
  Array(9).fill(null),
  Array(9).fill(null),
  Array(9).fill(null),
]

export default function TripleGame() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState(EMPTY_BOARDS)
  const [boardResults, setBoardResults] = useState([null, null, null])
  const [current, setCurrent] = useState('X')
  const [gameResult, setGameResult] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [playComputer, setPlayComputer] = useState(false)

  function handlePlay(boardIdx, cellIdx) {
    if (playComputer && current === 'O') return
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
    setBoardResults([null, null, null])
    setCurrent('X')
    setGameResult(null)
    setShowModal(false)
  }

  useEffect(() => {
    if (!playComputer || current !== 'O' || gameResult) return
    const timer = setTimeout(() => {
      const available = boardResults.map((r, i) => r === null ? i : null).filter(i => i !== null)
      const move = bestMultiBoardMove(boards, boardResults, available)
      if (!move) return
      const { boardIdx, cellIdx } = move
      const newBoards = boards.map((b, i) =>
        i === boardIdx ? b.map((v, j) => (j === cellIdx ? 'O' : v)) : b
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
        setCurrent('X')
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [current, playComputer, gameResult, boards, boardResults])

  const statusText = gameResult
    ? gameResult === 'draw' ? "It's a draw!" : `${gameResult} wins the match!`
    : `${current}'s turn`

  return (
    <div className="triple-game">
      <h1 className="triple-title">Triple</h1>
      <p className={`triple-status${gameResult && gameResult !== 'draw' ? ' winner' : ''}`}>
        {statusText}
      </p>

      <div className="triple-boards">
        {boards.map((squares, i) => (
          <div key={i} className={`triple-board-wrap${boardResults[i] ? ' decided' : ''}`}>
            <div className="board-container">
              <Board
                squares={squares}
                winLine={boardResults[i]?.line ?? null}
                onPlay={(cellIdx) => handlePlay(i, cellIdx)}
                className="board--triple"
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
        ))}
      </div>

      <div className="triple-controls">
        <button className="reset-btn" onClick={handleReset}>New Game</button>
        <button className="back-btn" onClick={() => navigate('/')}>Menu</button>
      </div>
      <ToggleSwitch
        checked={playComputer}
        onChange={e => setPlayComputer(e.target.checked)}
        label="Play Computer"
      />

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
