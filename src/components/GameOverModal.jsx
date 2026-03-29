import { useNavigate } from 'react-router-dom'
import './GameOverModal.css'

export default function GameOverModal({ winner, onPlayAgain, onClose }) {
  const navigate = useNavigate()

  const headline =
    winner === 'draw' ? "It's a Draw!" :
    winner === 'X'    ? 'X Wins!'      :
                        'O Wins!'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <p className={`modal-headline modal-headline--${winner}`}>{headline}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--primary" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="modal-btn modal-btn--secondary" onClick={() => navigate('/')}>
            Menu
          </button>
        </div>
      </div>
    </div>
  )
}
