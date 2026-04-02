import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'

export default function HireProfilePage() {
  const navigate = useNavigate()

  const [notificationsOn, setNotificationsOn] = useState(true)

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Your Profile</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Hire Mode 💜
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

        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_25px_rgba(124,58,237,0.06)]">
          <div className="flex flex-col items-center">
            <img
              src="https://source.unsplash.com/400x400/?ai,woman,portrait"
              alt="AI Generated Person"
              className="w-[96px] h-[96px] rounded-full object-cover border border-black/5"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-[20px] font-extrabold">Rahul Sharma</div>
            <div className="mt-1 text-[13px] font-semibold text-black/60">
              📍 Jubilee Hills, Hyderabad
            </div>
            <div className="mt-2 text-[14px] font-extrabold text-black/70">
              ⭐ Employer Rating: 4.9/5
            </div>
            <div className="mt-2 inline-flex items-center rounded-full px-4 py-2 bg-[color:var(--primary)]/10 border border-[color:var(--primary)]/30">
              <span className="text-[12px] font-extrabold text-[color:var(--primary)]">
                💜 Hire Mode Active
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-black/5 p-3 text-center">
              <div className="text-[11px] font-bold text-black/60">Bookings</div>
              <div className="text-[16px] font-extrabold">12</div>
            </div>
            <div className="rounded-2xl bg-black/5 p-3 text-center">
              <div className="text-[11px] font-bold text-black/60">This Month</div>
              <div className="text-[16px] font-extrabold">3</div>
            </div>
            <div className="rounded-2xl bg-black/5 p-3 text-center">
              <div className="text-[11px] font-bold text-black/60">Fav Workers</div>
              <div className="text-[16px] font-extrabold">3</div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[14px] font-extrabold text-black/70">PAYMENT METHODS</div>
            <div className="mt-2 text-[13px] text-black/60 font-semibold">
              UPI: rahul@upi ✅
            </div>
            <div className="mt-1 text-[13px] text-black/60 font-semibold">
              Wallet Balance: ₹1,500
            </div>
            <button
              type="button"
              onClick={() => alert('Add Money: payment flow is a demo.')}
              className="mt-3 h-[56px] w-full rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg hover:opacity-90 active:opacity-80"
            >
              Add Money
            </button>
          </div>

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[14px] font-extrabold text-black/70">SETTINGS</div>
            <div className="mt-2 text-[13px] text-black/60 font-semibold">
              Language: English &gt;
            </div>
            <button
              type="button"
              onClick={() => setNotificationsOn((p) => !p)}
              className="mt-2 w-full text-left text-[13px] text-black/60 font-semibold hover:text-black/70 active:opacity-90"
            >
              Notifications: {notificationsOn ? 'ON' : 'OFF'} &gt;
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  window.localStorage.clear()
                } catch {
                  // ignore
                }
                navigate('/')
              }}
              className="mt-3 h-[56px] w-full rounded-full bg-black/5 text-black/70 font-extrabold hover:bg-black/10 active:bg-black/20"
            >
              [Logout]
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

