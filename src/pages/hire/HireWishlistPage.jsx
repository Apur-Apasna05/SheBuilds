import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { WORKERS } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'
import { workerPhoto } from '../../utils/unsplash'

export default function HireWishlistPage() {
  const navigate = useNavigate()

  const favorites = useMemo(() => {
    const raw = window.localStorage.getItem('hireFavorites')
    if (!raw) {
      const seeded = ['priya-reddy', 'sunita-rao']
      window.localStorage.setItem('hireFavorites', JSON.stringify(seeded))
      return seeded
    }
    try {
      const v = JSON.parse(raw)
      return Array.isArray(v) ? v : []
    } catch {
      return []
    }
  }, [])

  const favoriteWorkers = WORKERS.filter((w) => favorites.includes(w.id))

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Wishlist</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Your favourite workers.
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
          {favoriteWorkers.map((w) => (
            <div
              key={w.id}
              className="rounded-3xl bg-white border border-black/10 p-4 shadow-[0_12px_25px_rgba(124,58,237,0.08)]"
            >
              <div className="flex flex-col items-center">
                <img
                  src={workerPhoto(w.id)}
                  alt={w.name}
                  className="w-[78px] h-[78px] rounded-full object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-2 text-center">
                  <div className="text-[18px] font-extrabold">{w.name}</div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    ⭐ {w.rating} • {w.skill}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-end">
                <div className="h-[44px] w-[44px] rounded-full bg-black/5 flex items-center justify-center text-[18px]">
                  ♥
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/hire/worker/${w.id}`)}
                  className="flex-1 h-[48px] rounded-2xl bg-black/5 font-extrabold text-[13px] text-black/70"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  disabled={w.availability !== 'available'}
                  onClick={() => navigate(`/hire/worker/${w.id}`)}
                  className={[
                    'flex-1 h-[48px] rounded-2xl font-extrabold text-[13px] transition-opacity',
                    w.availability === 'available'
                      ? 'bg-[color:var(--primary)] text-white'
                      : 'bg-black/10 text-black/40',
                  ].join(' ')}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
          {!favoriteWorkers.length && (
            <div className="mt-10 text-black/60 font-bold">
              Add favourites from workers list.
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

