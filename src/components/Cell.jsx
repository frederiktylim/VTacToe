import { forwardRef } from 'react'
import './Cell.css'

const Cell = forwardRef(function Cell({ value, isWin, onClick }, ref) {
  const cls = [
    'cell',
    value ? 'taken' : '',
    value ? value.toLowerCase() : '',
    isWin ? 'win' : '',
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={cls} onClick={onClick}>
      {value}
    </div>
  )
})

export default Cell
