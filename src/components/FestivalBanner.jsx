import React from 'react'
import { useAppState } from '../state/AppState'

export default function FestivalBanner({ compact = false }) {
  const { festival, autoMode } = useAppState()
  if (!festival) return null

  return (
    <div
      className={[
        'w-full rounded-2xl px-4 py-3 mb-3',
        'border border-white/10 bg-white/5',
      ].join(' ')}
      style={{
        backgroundImage:
          'linear-gradient(90deg, color-mix(in srgb, var(--festivalA) 40%, transparent), color-mix(in srgb, var(--festivalB) 28%, transparent))',
        borderColor: 'rgba(255,255,255,0.18)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-[14px] font-extrabold text-white">
          {festival.name}
        </div>
        {!compact && (
          <div className="text-[12px] font-bold text-white/80">
            Auto Mode {autoMode ? 'ON' : 'OFF'}
          </div>
        )}
      </div>
    </div>
  )
}

