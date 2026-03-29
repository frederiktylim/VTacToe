import { useNavigate } from 'react-router-dom'
import './ComingSoon.css'

export default function ComingSoon({ mode }) {
  const navigate = useNavigate()
  return (
    <div className="coming-soon">
      <h1 className="cs-title">{mode}</h1>
      <p className="cs-sub">Coming soon</p>
      <button className="cs-back" onClick={() => navigate('/')}>Menu</button>
    </div>
  )
}
