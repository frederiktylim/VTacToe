import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../components/Board'
import GameOverModal from '../components/GameOverModal'
import '../App.css'

const WINS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function checkWinner(squares) {
  for (const [a, b, c] of WINS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  if (squares.every(Boolean)) return { winner: 'draw', line: null }
  return null
}

export default function RegularGame() {
  const navigate = useNavigate()
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [current, setCurrent] = useState('X')
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 })
  const [result, setResult] = useState(null)
  const [showModal, setShowModal] = useState(false)

  function handlePlay(i) {
    if (result || squares[i]) return
    const next = squares.slice()
    next[i] = current
    const gameResult = checkWinner(next)
    setSquares(next)
    if (gameResult) {
      setResult(gameResult)
      setShowModal(true)
      if (gameResult.winner === 'draw') {
        setScores(s => ({ ...s, D: s.D + 1 }))
      } else {
        setScores(s => ({ ...s, [gameResult.winner]: s[gameResult.winner] + 1 }))
      }
    } else {
      setCurrent(c => (c === 'X' ? 'O' : 'X'))
    }
  }

  function handleReset() {
    setSquares(Array(9).fill(null))
    setCurrent('X')
    setResult(null)
    setShowModal(false)
  }

  const statusText = result
    ? result.winner === 'draw' ? "It's a draw!" : `${result.winner} wins!`
    : `${current}'s turn`

  return (
    <div className="game">
      <h1 className="title">TicTacV</h1>
      <p className={`status${result?.winner && result.winner !== 'draw' ? ' winner' : ''}`}>
        {statusText}
      </p>
      <Board squares={squares} winLine={result?.line ?? null} onPlay={handlePlay} />
      <button className="reset-btn" onClick={handleReset}>New Game</button>
      <div className="scoreboard">
        <div className="score-item x">
          <span className="score-label">X</span>
          <span className="score-num">{scores.X}</span>
        </div>
        <div className="score-item draw">
          <span className="score-label">Draws</span>
          <span className="score-num">{scores.D}</span>
        </div>
        <div className="score-item o">
          <span className="score-label">O</span>
          <span className="score-num">{scores.O}</span>
        </div>
      </div>
      <button className="back-btn" onClick={() => navigate('/')}>Menu</button>

      {showModal && (
        <GameOverModal
          winner={result.winner}
          onPlayAgain={handleReset}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
