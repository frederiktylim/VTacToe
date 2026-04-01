import './ToggleSwitch.css'

export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-input"
        checked={checked}
        onChange={onChange}
      />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{label}</span>
    </label>
  )
}
