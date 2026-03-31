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

const META_WIN_PATTERNS = [
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

function findMetaWinLine(results, player) {
  for (const [a, b, c] of META_WIN_PATTERNS) {
    if (
      results[a]?.winner === player &&
      results[b]?.winner === player &&
      results[c]?.winner === player
    ) {
      return [a, b, c]
    }
  }
  return null
}

function overallResult(results) {
  const xLine = findMetaWinLine(results, 'X')
  if (xLine) return { winner: 'X', metaLine: xLine }
  const oLine = findMetaWinLine(results, 'O')
  if (oLine) return { winner: 'O', metaLine: oLine }

  if (results.every(r => r !== null)) {
    const xWins = results.filter(r => r?.winner === 'X').length
    const oWins = results.filter(r => r?.winner === 'O').length
    if (xWins > oWins) return { winner: 'X', metaLine: null }
    if (oWins > xWins) return { winner: 'O', metaLine: null }
    return { winner: 'draw', metaLine: null }
  }
  return null
}

const EMPTY_BOARDS = () => Array.from({ length: 9 }, () => Array(9).fill(null))

export default function Level9DifferentSpotGame() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState(EMPTY_BOARDS)
  const [boardResults, setBoardResults] = useState(Array(9).fill(null))
  const [current, setCurrent] = useState('X')
  const [gameResult, setGameResult] = useState(null)
  const [metaWinLine, setMetaWinLine] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 })
  const [lastBoardByPlayer, setLastBoardByPlayer] = useState({ X: null, O: null })
  const [showCantDoThat, setShowCantDoThat] = useState(false)

  function handlePlay(boardIdx, cellIdx) {
    if (gameResult) return
    if (boardResults[boardIdx]) return

    if (lastBoardByPlayer[current] !== null && boardIdx === lastBoardByPlayer[current]) {
      setShowCantDoThat(true)
      return
    }

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
    setLastBoardByPlayer(prev => ({ ...prev, [current]: boardIdx }))

    const overall = overallResult(newBoardResults)
    if (overall !== null) {
      setGameResult(overall.winner)
      setMetaWinLine(overall.metaLine)
      setShowModal(true)
      setScores(s => ({
        ...s,
        [overall.winner === 'draw' ? 'D' : overall.winner]:
          s[overall.winner === 'draw' ? 'D' : overall.winner] + 1,
      }))
    } else {
      setCurrent(c => (c === 'X' ? 'O' : 'X'))
    }
  }

  function handleReset() {
    setBoards(EMPTY_BOARDS())
    setBoardResults(Array(9).fill(null))
    setCurrent('X')
    setGameResult(null)
    setMetaWinLine(null)
    setShowModal(false)
    setShowCantDoThat(false)
    setLastBoardByPlayer({ X: null, O: null })
  }

  const statusText = gameResult
    ? gameResult === 'draw'
      ? "It's a draw!"
      : metaWinLine
        ? `${gameResult} wins 3 in a row!`
        : `${gameResult} wins the match!`
    : `${current}'s turn`

  const renderBoardWrap = (i) => {
    const isMetaWin = metaWinLine?.includes(i)
    const metaClass = isMetaWin ? ` meta-win-${gameResult}` : ''
    const isRestricted = !gameResult && lastBoardByPlayer[current] === i && !boardResults[i]
    return (
      <div key={i} className={`l9-board-wrap${metaClass}${isRestricted ? ' restricted-board' : ''}`}>
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
      <h1 className="l9-title">Nine In a Row, Different Spot</h1>
      <p className={`l9-status${gameResult && gameResult !== 'draw' ? ' winner' : ''}`}>
        {statusText}
      </p>

      <div className="l9-boards">
        {Array.from({ length: 9 }, (_, i) => renderBoardWrap(i))}
      </div>

      <div className="l9-controls">
        <button className="reset-btn" onClick={handleReset}>New Game</button>
        <button className="back-btn" onClick={() => navigate('/level-9')}>Menu</button>
        <button className="rules-btn" onClick={() => setShowRules(true)}>Rules</button>
      </div>

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

      {showModal && (
        <GameOverModal
          winner={gameResult}
          onPlayAgain={handleReset}
          onClose={() => setShowModal(false)}
        />
      )}

      {showCantDoThat && (
        <div className="cant-overlay">
          <div className="cant-card">
            <button className="modal-close" onClick={() => setShowCantDoThat(false)}>✕</button>
            <div className="cant-minus" />
            <p className="cant-text">You can't do that.</p>
          </div>
        </div>
      )}

      {showRules && (
        <div className="rules-overlay" onClick={() => setShowRules(false)}>
          <div className="rules-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRules(false)}>✕</button>
            <h2 className="rules-title">Nine In a Row, Different Spot</h2>
            <div className="rules-body">
              <p className="rules-section-head">Objective</p>
              <p>Be the first player to win three boards in a row on the 3×3 grid of boards.</p>

              <p className="rules-section-head">How to play</p>
              <ul>
                <li>Players alternate turns placing X or O on any open cell of any unfinished board.</li>
                <li>Win a board by getting three of your symbols in a row on that board.</li>
                <li>You cannot play on the same board you just played on — you must wait at least one of your turns before returning to it.</li>
              </ul>

              <p className="rules-section-head">Winning the match</p>
              <ul>
                <li>Win three boards in a row — horizontally, vertically, or diagonally — across the 3×3 grid. The game ends immediately.</li>
                <li>If no player achieves three boards in a row, the player who won the most individual boards wins.</li>
                <li>If both players won the same number of boards, the match is a draw.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
