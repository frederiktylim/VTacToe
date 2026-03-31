import { useNavigate } from 'react-router-dom'
import './Level9Menu.css'

export default function Level9Menu() {
  const navigate = useNavigate()
  return (
    <div className="l9-menu">
      <h1 className="l9-menu-title">Level 9</h1>
      <p className="l9-menu-sub">Choose a variant</p>
      <div className="l9-mode-list">
        <button className="l9-mode-btn" onClick={() => navigate('/level-9/regular')}>
          <span className="l9-mode-label">Level 9 (Regular)</span>
          <span className="l9-mode-desc">9 boards · win 5 to win</span>
        </button>
        <button className="l9-mode-btn" onClick={() => navigate('/level-9/three-in-a-row')}>
          <span className="l9-mode-label">Level 9 (3 in a Row)</span>
          <span className="l9-mode-desc">9 boards · get 3 boards in a row</span>
        </button>
        <button className="l9-mode-btn" onClick={() => navigate('/level-9/different-spot')}>
          <span className="l9-mode-label">Nine In a Row, Different Spot</span>
          <span className="l9-mode-desc">3 in a row · can't reuse opponent's last board</span>
        </button>
      </div>
      <button className="back-btn" onClick={() => navigate('/')}>Menu</button>
    </div>
  )
}
