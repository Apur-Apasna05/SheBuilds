import React, { useMemo } from 'react'
import { Pie, PieChart, Cell } from 'recharts'
import { CHIT_FUND } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'

const PAID_COLOR = '#FF2D78'
const ROSE_COLOR = '#FB7185'

export default function EarnChitFundPage() {
  const paidCount = useMemo(
    () => CHIT_FUND.monthlyPaid.filter(Boolean).length,
    []
  )
  const total = CHIT_FUND.months.length
  const remaining = total - paidCount

  const pieData = useMemo(() => {
    return [
      { name: 'Paid', value: paidCount },
      { name: 'Remaining', value: remaining },
    ]
  }, [paidCount, remaining])

  const members = useMemo(() => {
    return [
      { idx: 0, name: 'Priya', portrait: 11 },
      { idx: 1, name: 'Sunita', portrait: 22 },
      { idx: 2, name: 'Fatima', portrait: 33 },
      { idx: 3, name: 'Ananya', portrait: 44 },
      { idx: 4, name: 'Lakshmi', portrait: 55 },
      { idx: 5, name: 'Ritu', portrait: 21 },
      { idx: 6, name: 'Meena', portrait: 31 },
      { idx: 7, name: 'Kavya', portrait: 41 },
      { idx: 8, name: 'Divya', portrait: 51 },
      { idx: 9, name: 'Pooja', portrait: 61 },
    ]
  }, [])

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="text-[18px] font-extrabold">Chit Fund 💰</div>

        <div className="mt-4 flex items-center justify-between gap-2">
          {CHIT_FUND.months.map((m, idx) => {
            const paid = CHIT_FUND.monthlyPaid[idx]
            const isCurrent = idx === CHIT_FUND.currentMonthIndex
            return (
              <div key={m} className="flex flex-col items-center">
                <div
                  className="h-[44px] w-[44px] rounded-full flex items-center justify-center relative"
                  style={{
                    background: paid ? PAID_COLOR : 'transparent',
                    border: isCurrent
                      ? `2px solid ${PAID_COLOR}`
                      : '2px solid rgba(0,0,0,0.08)',
                    animation: isCurrent ? 'pulse 1.4s infinite' : 'none',
                  }}
                >
                  {paid ? '✅' : isCurrent ? '⏳' : '⭕'}
                </div>
                <div className="mt-1 text-[12px] font-extrabold text-black/60">
                  {m}
                </div>
              </div>
            )
          })}
        </div>

        <style>{`
          @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.75; } 100% { transform: scale(1); opacity: 1; } }
        `}</style>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="font-extrabold text-[14px] text-black/70">
              Monthly progress
            </div>
            <div className="text-[12px] font-extrabold text-black/60">
              {paidCount}/{total} paid
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center relative">
            <div className="w-[240px] h-[240px]">
              <PieChart width={240} height={240}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={78}
                  outerRadius={108}
                  stroke="none"
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={idx === 0 ? PAID_COLOR : ROSE_COLOR}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="absolute text-center">
              <div className="text-[18px] font-extrabold">3 months more!</div>
              <div className="text-[12px] font-extrabold text-black/60">
                Target: {CHIT_FUND.targetLabel}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-black/5 p-3">
            <div className="text-[14px] font-extrabold">{CHIT_FUND.dueNowLabel}</div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="flex-1 h-[48px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold"
              >
                Pay Now 💳
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-bold text-black/60">
                Group
              </div>
              <div className="text-[13px] font-extrabold text-black/70">
                {CHIT_FUND.membersCount} members
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {members.map((m) => {
                const isWinner = m.idx === CHIT_FUND.currentMonthIndex
                const isPaid = m.idx < paidCount
                const url = `https://randomuser.me/api/portraits/women/${m.portrait}.jpg`

                return (
                  <div key={m.idx} className="flex flex-col items-center">
                    <div
                      className="relative h-[48px] w-[48px] rounded-full overflow-hidden bg-black/5"
                      style={{
                        border: isWinner ? '3px solid #FBBF24' : '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <img
                        src={url}
                        alt={m.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      {isPaid ? (
                        <div className="absolute -top-1 -right-1 h-[20px] w-[20px] rounded-full bg-green-600 flex items-center justify-center text-white text-[12px] font-extrabold">
                          ✓
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-1 text-[11px] font-extrabold text-black/70">
                      {m.name}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 text-[13px] font-semibold text-black/70">
              Your turn: {CHIT_FUND.yourTurnLabel} 🎉
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

