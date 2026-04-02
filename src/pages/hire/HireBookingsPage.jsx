import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { workerPhoto } from '../../utils/unsplash'

function normalizeBookings(raw) {
  if (!Array.isArray(raw)) return []
  return raw
}

function FilterChip({ id, label, activeId, onSelect }) {
  const active = activeId === id
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={[
        'rounded-full px-4 py-2 text-[13px] font-extrabold',
        active ? 'bg-[color:var(--primary)] text-white' : 'bg-black/5 text-black/70',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export default function HireBookingsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const bookings = useMemo(() => {
    const raw = JSON.parse(window.localStorage.getItem('hireBookings') || 'null')
    const base = Array.isArray(raw) ? raw : []
    // Merge seeded booking history once (so the demo has content even before new bookings).
    const seededRaw = window.localStorage.getItem('hireBookingsSeeded')
    if (!seededRaw) {
      const seeded = [
        {
          id: 'bk-priya-2026-04-20',
          workerId: 'priya-reddy',
          workerName: 'Priya Reddy',
          skill: 'Stitching',
          dateLabel: '20 April',
          slotLabel: '8-10 AM',
          amount: 300,
          status: 'completed',
          rating: 5,
        },
        {
          id: 'bk-fatima-2026-02-28',
          workerId: 'fatima-begum',
          workerName: 'Fatima Begum',
          skill: 'Mehendi',
          dateLabel: '28 Feb',
          slotLabel: '—',
          amount: 800,
          status: 'completed',
          rating: 4,
        },
        {
          id: 'bk-sunita-2026-03-05',
          workerId: 'sunita-rao',
          workerName: 'Sunita Rao',
          skill: 'Cooking',
          dateLabel: '5 Mar',
          slotLabel: '—',
          amount: 360,
          status: 'completed',
          rating: 4,
        },
      ]
      window.localStorage.setItem(
        'hireBookings',
        JSON.stringify([...seeded, ...base])
      )
      window.localStorage.setItem('hireBookingsSeeded', '1')
      return seeded
    }
    return normalizeBookings(raw)
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings
    if (filter === 'completed') return bookings.filter((b) => b.status === 'completed')
    if (filter === 'upcoming') return bookings.filter((b) => b.status === 'upcoming')
    if (filter === 'cancelled') return bookings.filter((b) => b.status === 'cancelled')
    return bookings
  }, [bookings, filter])

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Recent bookings</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Filter and manage bookings.
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

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip
            id="all"
            label="All"
            activeId={filter}
            onSelect={setFilter}
          />
          <FilterChip
            id="completed"
            label="Completed"
            activeId={filter}
            onSelect={setFilter}
          />
          <FilterChip
            id="upcoming"
            label="Upcoming"
            activeId={filter}
            onSelect={setFilter}
          />
          <FilterChip
            id="cancelled"
            label="Cancelled"
            activeId={filter}
            onSelect={setFilter}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl bg-white border border-black/10 shadow-[0_12px_25px_rgba(124,58,237,0.08)] p-4"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={workerPhoto(b.workerId)}
                  alt={b.workerName}
                  className="w-[78px] h-[78px] rounded-full object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-2 text-[16px] font-extrabold">
                  {b.workerName} | {b.skill}
                </div>
                <div className="mt-1 text-[13px] text-black/60 font-semibold">
                  {b.dateLabel} • {b.slotLabel} • ₹{b.amount}{' '}
                  {b.status === 'completed' ? '✅' : '⏳'}
                </div>
                {b.status === 'completed' && (
                  <div className="text-[13px] text-black/70 font-semibold mt-1">
                    {'⭐'.repeat(5)}
                  </div>
                )}
              </div>

              {b.status === 'completed' ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/hire/worker/${b.workerId}`)}
                    className="flex-1 h-[48px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold"
                  >
                    Book Again
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-[13px] text-black/60 font-semibold">
                  Upcoming booking.
                </div>
              )}
            </div>
          ))}

          {!filtered.length && (
            <div className="mt-6 text-black/60 font-bold">
              No bookings for this filter.
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

