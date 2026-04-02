import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { JOB_POSTS } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'

export default function EarnOrdersPage() {
  const navigate = useNavigate()

  const orders = useMemo(() => {
    try {
      const raw = window.localStorage.getItem('earnOrders') || '[]'
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [])

  const byJob = (jobId) => JOB_POSTS.find((j) => j.id === jobId)

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Orders</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Accepted jobs
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
          {orders.length === 0 ? (
            <div className="text-black/60 font-bold">No accepted jobs yet.</div>
          ) : (
            orders.map((o) => {
              const job = byJob(o.jobId)
              return (
                <div
                  key={o.id}
                  className="rounded-3xl bg-white border border-black/10 p-4"
                >
                  <div className="text-[16px] font-extrabold">
                    {job?.emoji || '🧵'} {o.skill}
                  </div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    {o.employer} • {o.due} • ₹{o.pricePerHr}/hr
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

