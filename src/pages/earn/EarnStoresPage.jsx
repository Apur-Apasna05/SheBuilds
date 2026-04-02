import React from 'react'
import { useNavigate } from 'react-router-dom'
import { STORE_LIST } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'
import { storePhoto } from '../../utils/unsplash'

export default function EarnStoresPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Stores Near You 📍</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Apply and start earning.
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/earn/home')}
            className="h-[40px] w-[40px] rounded-full bg-black/5"
            aria-label="Back"
          >
            ←
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {STORE_LIST.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl bg-white border border-black/10 shadow-[0_12px_25px_rgba(255,45,120,0.08)] p-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={storePhoto(s.id)}
                  alt={s.name}
                  className="w-[88px] h-[72px] rounded-2xl object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="text-[18px] font-extrabold">{s.name}</div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    {s.location} • {s.note}
                  </div>
                  <div className="mt-1 text-[16px] font-extrabold">
                    ₹{s.pricePerHr}/hr
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Application submitted! ✅')}
                className="mt-4 h-[52px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold w-full"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <button
            type="button"
            onClick={() => navigate('/earn/vendors')}
            className="w-full h-[52px] rounded-2xl bg-black/5 font-extrabold text-black/70"
          >
            Vendor Support 🤝
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

