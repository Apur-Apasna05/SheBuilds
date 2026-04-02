import React from 'react'
import { useAppState } from '../state/AppState'

export default function ModeToggle({ isEarnMode, onToggle }) {
  const { pushToast } = useAppState()

  const handleClick = () => {
    const next = !isEarnMode
    onToggle?.(next)
    pushToast({
      message: next ? 'Earn Mode 👩' : 'Hire Mode 💼',
      durationMs: 2000,
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle mode"
      className={`toggle-pill ${isEarnMode ? 'earn-mode' : ''}`}
    >
      <div className="toggle-circle" />

      <div className="toggle-text-row">
        {!isEarnMode ? (
          <>
            <div>OFF</div>
            <div style={{ marginLeft: 'auto', marginRight: 8 }}>HIRE MODE</div>
          </>
        ) : (
          <>
            <div style={{ marginLeft: 8 }}>EARN MODE</div>
            <div>ON</div>
          </>
        )}
      </div>
    </button>
  )
}

