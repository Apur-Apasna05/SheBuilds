import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HIRE_NOTIFICATIONS } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'

export default function HireNotificationsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Notifications</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Updates from your workers.
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/hire/home')}
            className="h-[40px] w-[40px] rounded-full bg-black/5"
            aria-label="Back"
          >
            ←
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {HIRE_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="rounded-3xl border border-black/10 bg-white p-4 flex items-start gap-3"
            >
              <div className="text-[24px]">{n.emoji}</div>
              <div className="text-[14px] font-extrabold text-black/80">
                {n.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

