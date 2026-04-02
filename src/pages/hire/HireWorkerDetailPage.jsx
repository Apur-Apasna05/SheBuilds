import React, { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  HIRE_WORKER_TIME_SLOTS,
  WORKERS,
} from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'
import { workerPhoto } from '../../utils/unsplash'

export default function HireWorkerDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [params] = useSearchParams()

  const worker = useMemo(() => WORKERS.find((w) => w.id === id), [id])
  const defaultSlotId = params.get('slot') || '8-10'

  const [selectedSlotId, setSelectedSlotId] = useState(defaultSlotId)
  const selectedSlot = useMemo(
    () => HIRE_WORKER_TIME_SLOTS.find((s) => s.id === selectedSlotId) || HIRE_WORKER_TIME_SLOTS[0],
    [selectedSlotId]
  )

  if (!worker) {
    return (
      <div className="p-5">
        <div className="text-black/60 font-bold">Worker not found.</div>
        <button
          className="mt-4 h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold w-full"
          onClick={() => navigate('/hire/home')}
        >
          Back
        </button>
      </div>
    )
  }

  const estimatedTotal = worker.pricePerHr * selectedSlot.hours

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

        <div className="mt-4 flex flex-col items-center">
          <img
            src={workerPhoto(worker.id)}
            alt={worker.name}
            className="w-[92px] h-[92px] rounded-full object-cover border border-black/5"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="mt-3 text-center">
            <div className="text-[22px] font-extrabold">{worker.name}</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              ⭐ {worker.rating}/5 • {worker.skill}
            </div>
            <div className="mt-2 text-[13px] font-bold text-black/70">
              Working Hours: {worker.workingHours}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-[14px] font-extrabold">Pick a slot</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {HIRE_WORKER_TIME_SLOTS.map((s) => {
              const active = selectedSlotId === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSlotId(s.id)}
                  className={[
                    'rounded-2xl h-[46px] font-extrabold text-[13px] border',
                    active
                      ? 'bg-[color:var(--primary)] text-white border-transparent'
                      : 'bg-white border-black/10 text-black/70',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-bold text-black/60">
                Payment
              </div>
              <div className="text-[20px] font-extrabold">
                ₹{worker.pricePerHr}/hr
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-black/60">
                Estimated total
              </div>
              <div className="text-[20px] font-extrabold">
                ₹{estimatedTotal}
              </div>
            </div>
          </div>
          <div className="mt-3 text-[13px] text-black/60 font-semibold">
            Slot duration: {selectedSlot.hours} hours
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-[14px] font-extrabold">
              AI Match Score
            </div>
            <div className="text-[14px] font-extrabold text-[color:var(--primary)]">
              87% compatibility
            </div>
          </div>
          <div className="mt-2 h-[12px] rounded-full bg-black/5 overflow-hidden">
            <div
              className="h-full bg-[color:var(--primary)]"
              style={{ width: '87%' }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            // Persist booking draft for Payment + Track screens.
            const draft = {
              workerId: worker.id,
              workerName: worker.name,
              skill: worker.skill,
              slotId: selectedSlot.id,
              slotLabel: selectedSlot.label,
              hours: selectedSlot.hours,
              pricePerHr: worker.pricePerHr,
              total: estimatedTotal,
              distanceKm: worker.distanceKm,
              etaMins: 10,
            }
            window.localStorage.setItem(
              'activeHireBookingDraft',
              JSON.stringify(draft)
            )
            navigate('/hire/payment')
          }}
          className="mt-5 h-[56px] w-full rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
        >
          BOOK NOW
        </button>
      </div>
      <BottomNav />
    </div>
  )
}

