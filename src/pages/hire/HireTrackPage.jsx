import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'

const TRACK_STEPS = [
  { label: 'Booked', icon: '✅' },
  { label: 'On Way', icon: '🚶‍♀️' },
  { label: 'Arrived', icon: '✅' },
  { label: 'Working', icon: '⚡' },
  { label: 'Done', icon: '🎉' },
]

export default function HireTrackPage() {
  const navigate = useNavigate()
  const draft = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem('activeHireBookingDraft') || 'null')
    } catch {
      return null
    }
  }, [])

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!draft) return
    const id = window.setInterval(() => {
      setStepIndex((p) => Math.min(p + 1, TRACK_STEPS.length - 1))
    }, 2200)
    return () => window.clearInterval(id)
  }, [draft])

  if (!draft) {
    return (
      <div className="p-5">
        <div className="text-black/60 font-bold">No active tracking found.</div>
        <button
          className="mt-4 h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold w-full"
          onClick={() => navigate('/hire/home')}
        >
          Back to Home
        </button>
      </div>
    )
  }

  const progress = ((stepIndex + 1) / TRACK_STEPS.length) * 100

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-[44px] w-[44px] rounded-full bg-black/5 flex items-center justify-center font-extrabold"
          aria-label="Back"
        >
          ←
        </button>

        <div className="mt-4 text-[20px] font-extrabold">Track</div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            {TRACK_STEPS.map((s, idx) => {
              const active = idx <= stepIndex
              return (
                <div
                  key={s.label}
                  className={[
                    'flex-1 text-center rounded-2xl py-2',
                    active ? 'bg-[color:var(--primary)]/10' : '',
                  ].join(' ')}
                >
                  <div className="text-[16px]">{s.icon}</div>
                  <div className="text-[12px] font-extrabold text-black/70">
                    {s.label}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 h-[10px] rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full bg-[color:var(--primary)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 text-[13px] font-semibold text-black/60">
            {draft.workerName} is {draft.distanceKm}km away • {draft.etaMins}{' '}
            mins
          </div>
        </div>

        <div className="mt-4 h-[170px] rounded-3xl bg-black/5 flex items-center justify-center text-black/50 font-extrabold">
          Mock map placeholder 🗺️
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 h-[56px] rounded-2xl bg-black/5 font-extrabold text-black/70"
            onClick={() => alert('Mock message')}
          >
            💬 Message
          </button>
          <button
            type="button"
            className="flex-1 h-[56px] rounded-2xl bg-black/5 font-extrabold text-black/70"
            onClick={() => alert('Mock call')}
          >
            📞 Call
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

