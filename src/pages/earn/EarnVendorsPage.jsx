import React from 'react'
import { useNavigate } from 'react-router-dom'
import { VENDOR_LIST } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'
import { storePhoto } from '../../utils/unsplash'

export default function EarnVendorsPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Vendor Support 🤝</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Buy supplies at wholesale price
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/earn/stores')}
            className="h-[40px] w-[40px] rounded-full bg-black/5"
            aria-label="Back"
          >
            ←
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {VENDOR_LIST.map((v) => (
            <div
              key={v.id}
              className="rounded-3xl bg-white border border-black/10 shadow-[0_12px_25px_rgba(255,45,120,0.08)] p-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={storePhoto(v.id)}
                  alt={v.name}
                  className="w-[88px] h-[72px] rounded-2xl object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="text-[18px] font-extrabold">{v.name}</div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    {v.location}
                  </div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    📞 {v.phone}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Opening contact for ${v.name}... 📞`)}
                className="mt-4 h-[52px] w-full rounded-2xl bg-[color:var(--primary)] text-white font-extrabold"
              >
                Contact Vendor
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

