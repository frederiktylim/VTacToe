import { useRef, useEffect, useId } from 'react'
import Cell from './Cell'
import './Board.css'

export default function Board({ squares, winLine, onPlay, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `win-gradient-${uid}`
  const cellRefs = useRef([])
  const svgRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    // Remove any existing line
    if (lineRef.current) {
      lineRef.current.remove()
      lineRef.current = null
    }

    if (!winLine || !svg) return

    const boardRect = svg.parentElement.getBoundingClientRect()
    const a = cellRefs.current[winLine[0]].getBoundingClientRect()
    const b = cellRefs.current[winLine[2]].getBoundingClientRect()

    const acx = a.left + a.width / 2 - boardRect.left
    const acy = a.top + a.height / 2 - boardRect.top
    const bcx = b.left + b.width / 2 - boardRect.left
    const bcy = b.top + b.height / 2 - boardRect.top

    // Determine line type from cell indices, not from computed coords,
    // to avoid floating-point drift causing diagonal lines.
    const colA = winLine[0] % 3
    const colB = winLine[2] % 3
    const rowA = Math.floor(winLine[0] / 3)
    const rowB = Math.floor(winLine[2] / 3)
    const isVertical   = colA === colB
    const isHorizontal = rowA === rowB

    let x1, y1, x2, y2
    if (isVertical) {
      x1 = acx;           y1 = acy - a.height / 2
      x2 = acx;           y2 = bcy + b.height / 2
    } else if (isHorizontal) {
      x1 = acx - a.width / 2;  y1 = acy
      x2 = bcx + b.width / 2;  y2 = acy
    } else {
      // Diagonal — extend to the far corner of each end cell
      const dx = Math.sign(bcx - acx)
      const dy = Math.sign(bcy - acy)
      x1 = acx - dx * (a.width / 2);   y1 = acy - dy * (a.height / 2)
      x2 = bcx + dx * (b.width / 2);   y2 = bcy + dy * (b.height / 2)
    }

    const gradient = svg.querySelector(`#${gradientId}`)
    gradient.setAttribute('x1', x1)
    gradient.setAttribute('y1', y1)
    gradient.setAttribute('x2', x2)
    gradient.setAttribute('y2', y2)
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse')

    const winner = squares[winLine[0]]
    const stops = gradient.querySelectorAll('stop')
    if (winner === 'O') {
      stops[0].setAttribute('stop-color', '#52a8e0')
      stops[1].setAttribute('stop-color', '#e05252')
    } else {
      stops[0].setAttribute('stop-color', '#e05252')
      stops[1].setAttribute('stop-color', '#52a8e0')
    }

    const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    lineEl.setAttribute('x1', x1)
    lineEl.setAttribute('y1', y1)
    lineEl.setAttribute('x2', x2)
    lineEl.setAttribute('y2', y2)
    lineEl.setAttribute('stroke', `url(#${gradientId})`)
    lineEl.setAttribute('stroke-width', '6')
    lineEl.setAttribute('stroke-linecap', 'round')
    const len = Math.hypot(x2 - x1, y2 - y1)
    lineEl.style.strokeDasharray = len
    lineEl.style.strokeDashoffset = len
    lineEl.style.animation = 'draw-line 0.4s ease-out forwards'
    svg.appendChild(lineEl)
    lineRef.current = lineEl
  }, [winLine, squares])

  return (
    <div className={`board${className ? ` ${className}` : ''}`}>
      {squares.map((val, i) => (
        <Cell
          key={i}
          value={val}
          isWin={winLine?.includes(i)}
          onClick={() => onPlay(i)}
          ref={el => (cellRefs.current[i] = el)}
        />
      ))}
      <svg
        ref={svgRef}
        className="win-line-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor="#e05252" />
            <stop offset="100%" stopColor="#52a8e0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
