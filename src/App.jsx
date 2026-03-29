import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import RegularGame from './pages/RegularGame'
import TripleGame from './pages/TripleGame'
import FiveMusketeerGame from './pages/FiveMusketeerGame'
import Level9Menu from './pages/Level9Menu'
import Level9RegularGame from './pages/Level9RegularGame'
import Level9ThreeInARowGame from './pages/Level9ThreeInARowGame'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/regular" element={<RegularGame />} />
      <Route path="/triple" element={<TripleGame />} />
      <Route path="/five-musketeers" element={<FiveMusketeerGame />} />
      <Route path="/level-9" element={<Level9Menu />} />
      <Route path="/level-9/regular" element={<Level9RegularGame />} />
      <Route path="/level-9/three-in-a-row" element={<Level9ThreeInARowGame />} />
    </Routes>
  )
}
