import { useNavigate } from 'react-router-dom'
import './Landing.css'

const MODES = [
  { label: 'Regular',         path: '/regular',         desc: '3×3 classic' },
  { label: 'Triple',          path: '/triple',          desc: '3 boards · win 2 to win' },
  { label: 'Five Musketeers', path: '/five-musketeers', desc: '5 boards · win 3 to win' },
  { label: 'Level 9',         path: '/level-9',         desc: '9 boards · 2 variants' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <h1 className="landing-title">TicTacV</h1>
      <p className="landing-sub">Choose a game mode</p>
      <div className="mode-list">
        {MODES.map(({ label, path, desc }) => (
          <button key={path} className="mode-btn" onClick={() => navigate(path)}>
            <span className="mode-label">{label}</span>
            <span className="mode-desc">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
