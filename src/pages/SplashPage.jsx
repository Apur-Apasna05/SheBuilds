import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Keep splash static; no auto-redirect.
  }, [])

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div
        className="flex-1 flex flex-col items-center justify-center text-center px-6"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,45,120,0.28), rgba(124,58,237,0.28))',
        }}
      >
        <div className="text-[70px] leading-none">👑</div>

        <div className="mt-2 text-[34px] font-extrabold tracking-tight">
          SheBuilds
        </div>

        <div className="mt-3 text-[15px] font-semibold text-black/70 max-w-[320px]">
          Your Skills. Your Money. Your Freedom.
        </div>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-[320px]">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-[14px] font-bold text-black/60"
          >
            Already have account? Login
          </button>
        </div>
      </div>
    </div>
  )
}

