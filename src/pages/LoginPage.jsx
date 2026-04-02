import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workerPhoto } from '../utils/unsplash'

export default function LoginPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('Priya Reddy')

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div className="p-5 pt-8 flex-1">
        <div className="text-[28px] font-extrabold text-black tracking-tight">
          {step === 0 ? 'Login' : step === 1 ? 'OTP Verification' : 'Your Details'}
        </div>
        <div className="mt-2 text-[14px] text-black/60 font-semibold">
          {step === 0
            ? 'Enter your phone number'
            : step === 1
              ? 'Enter the 4-digit OTP (any works)'
              : 'Tell us your name'}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {step === 0 && (
            <>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="Phone number"
                className="h-[56px] rounded-2xl border border-black/10 px-4 text-[16px] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
              />
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
              >
                Continue
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                placeholder="Enter OTP"
                className="h-[56px] rounded-2xl border border-black/10 px-4 text-[16px] outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-center tracking-widest"
              />
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setOtp('')}
                className="text-[13px] font-bold text-black/50"
              >
                Didn’t get OTP? Resend
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={workerPhoto('onboarding')}
                  alt="Profile avatar"
                  className="w-[92px] h-[92px] rounded-full object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="w-full">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-[56px] rounded-2xl border border-black/10 px-4 text-[16px] outline-none focus:ring-2 focus:ring-[color:var(--primary)] w-full"
                  />
                  <div className="mt-2 text-[13px] text-black/60 font-semibold">
                    Dilsukhnagar • Stitching
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/language')}
                className="h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
              >
                Let&apos;s Go! 💪
              </button>
            </>
          )}
        </div>
      </div>
      <div className="p-5 pb-8 text-[12px] text-black/40 font-bold">
        Mock login flow for SheBuilds.
      </div>
    </div>
  )
}

