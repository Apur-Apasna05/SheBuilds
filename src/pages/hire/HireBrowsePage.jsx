import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { WORKERS } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'
import { workerPhoto } from '../../utils/unsplash'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'dance', label: 'Dance' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'stitching', label: 'Stitching' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'painting', label: 'Painting' },
  { id: 'tuition', label: 'Tuition' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'pickle', label: 'Pickle Making' },
]

const CATEGORY_TO_WORKER_SKILL = {
  all: null,
  dance: 'Dance',
  makeup: 'Mehendi',
  stitching: 'Stitching',
  cooking: 'Cooking',
  painting: 'Painting',
  tuition: 'Tuition',
  cleaning: 'Cleaning',
  pickle: 'Pickle Making',
}

export default function HireBrowsePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const categoryFromUrl = params.get('category') || 'all'

  const initialCategory = useMemo(() => {
    const valid = new Set(FILTERS.map((c) => c.id))
    return valid.has(categoryFromUrl) ? categoryFromUrl : 'all'
  }, [categoryFromUrl])

  const [activeCategory, setActiveCategory] = useState(initialCategory)

  useEffect(() => {
    setActiveCategory(initialCategory)
  }, [initialCategory])

  const filtered = useMemo(() => {
    const skill = CATEGORY_TO_WORKER_SKILL[activeCategory]
    if (!skill) return WORKERS
    return WORKERS.filter((w) => w.skill === skill)
  }, [activeCategory])

  const activeLabel = useMemo(() => {
    const found = FILTERS.find((f) => f.id === activeCategory)
    return found?.label || 'All'
  }, [activeCategory])

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Available Near You</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              {activeCategory === 'all' ? (
                <>
                  {WORKERS.length} experts near you
                </>
              ) : filtered.length ? (
                <>
                  {filtered.length} {activeLabel} experts near you
                </>
              ) : (
                <>No experts found in this category</>
              )}
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
          {FILTERS.map((f) => {
            const active = activeCategory === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveCategory(f.id)}
                className={[
                  'rounded-full px-4 py-2 text-[13px] font-extrabold',
                  active
                    ? 'bg-[color:var(--primary)] text-white'
                    : 'bg-white border border-black/10 text-black/70',
                ].join(' ')}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="rounded-3xl bg-white border border-black/10 shadow-[0_12px_25px_rgba(124,58,237,0.08)] p-4"
            >
              <div className="flex flex-col items-center">
                <img
                  src={workerPhoto(w.id)}
                  alt={w.name}
                  className="w-[86px] h-[86px] rounded-full object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-2 w-full">
                  <div className="text-[18px] font-extrabold text-center">
                    {w.name}
                  </div>
                  <div className="text-[13px] text-black/60 font-semibold mt-1 text-center">
                    ⭐ {w.rating} • {w.skill} • {w.distanceKm}km away
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="text-[16px] font-extrabold">
                      ₹{w.pricePerHr}/hr
                    </div>
                    <div
                      className={[
                        'rounded-full px-3 py-1 text-[12px] font-extrabold',
                        w.availability === 'available'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-[color:var(--primary)] text-white',
                      ].join(' ')}
                    >
                      {w.availability === 'available'
                        ? 'Available 🟢'
                        : 'Booked 🔴'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/hire/worker/${w.id}`)}
                  className="flex-1 h-[46px] rounded-2xl bg-black/5 font-extrabold text-[13px]"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (w.availability !== 'available') {
                      return
                    }
                    navigate(`/hire/worker/${w.id}`)
                  }}
                  disabled={w.availability !== 'available'}
                  className={[
                    'flex-1 h-[46px] rounded-2xl font-extrabold text-[13px] transition-opacity',
                    w.availability === 'available'
                      ? 'bg-[color:var(--primary)] text-white'
                      : 'bg-black/10 text-black/40',
                  ].join(' ')}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}

          {!filtered.length && (
            <div className="text-black/60 font-bold mt-6">
              No experts found in this category
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

