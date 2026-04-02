import React, { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppState } from '../../state/AppState'
import { HIRE_CATEGORIES, STORE_LIST, VENDOR_LIST, WORKERS } from '../../data/dummyData'
import ModeToggle from '../../components/ModeToggle'
import FestivalBanner from '../../components/FestivalBanner'
import BottomNav from '../../components/BottomNav'
import { categoryPhoto, storePhoto, workerPhoto } from '../../utils/unsplash'

export default function HireHomePage() {
  const navigate = useNavigate()
  const { appMode, setAppModeAndPersist } = useAppState()
  const [params] = useSearchParams()
  const activeCat = params.get('category') || ''

  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []

    const workerResults = WORKERS.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q)
    ).map((w) => ({ type: 'worker', id: w.id, title: w.name, subtitle: w.skill }))

    const storeResults = STORE_LIST.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    ).map((s) => ({ type: 'store', id: s.id, title: s.name, subtitle: s.location }))

    const vendorResults = VENDOR_LIST.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q)
    ).map((v) => ({ type: 'vendor', id: v.id, title: v.name, subtitle: v.location }))

    return [...workerResults, ...storeResults, ...vendorResults]
  }, [searchQuery])

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-[20px]">👑</div>
            <div className="text-[18px] font-extrabold">SheBuilds</div>
          </div>

          <div className="flex-1">
            <div className="relative flex items-center bg-[#F5F5F5] rounded-full px-4 h-[44px] ring-1 ring-black/10">
              <span className="mr-2 text-black/50">🔍</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, names..."
                className="bg-transparent outline-none text-[14px] w-full placeholder:text-black/40"
                style={{
                  boxShadow:
                    searchQuery.length > 0
                      ? '0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent)'
                      : undefined,
                }}
              />
              {searchQuery.trim().length > 0 ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-[28px] w-[28px] rounded-full bg-black/5 text-black/70 font-extrabold"
                >
                  ×
                </button>
              ) : null}
            </div>

            {searchQuery.trim().length > 0 ? (
              <div className="mt-3">
                <div className="text-[12px] font-extrabold text-black/60 text-left">
                  {searchResults.length} results found
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {searchResults.length ? (
                    searchResults.slice(0, 8).map((r) => (
                      <button
                        key={`${r.type}_${r.id}`}
                        type="button"
                        className="w-full rounded-2xl bg-white border border-black/10 p-3 text-left hover:bg-black/5 active:bg-black/10 transition-all"
                        onClick={() => {
                          if (r.type === 'worker') {
                            navigate(`/hire/worker/${r.id}`)
                          } else if (r.type === 'store') {
                            setAppModeAndPersist('earn')
                            navigate('/earn/stores')
                          } else {
                            setAppModeAndPersist('earn')
                            navigate('/earn/vendors')
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          {r.type === 'worker' ? (
                            <img
                              src={workerPhoto(r.id)}
                              alt={r.title}
                              className="w-[44px] h-[44px] rounded-full object-cover border border-black/5"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <img
                              src={storePhoto(r.id)}
                              alt={r.title}
                              className="w-[44px] h-[44px] rounded-full object-cover border border-black/5"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="flex-1">
                            <div className="text-[14px] font-extrabold text-black/80">
                              {r.title}
                            </div>
                            <div className="text-[12px] font-semibold text-black/55">
                              {r.subtitle}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-black/5 p-4 text-center text-black/60 font-bold">
                      😔 No results for '{searchQuery.trim()}'
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="h-[44px] w-[44px] rounded-full bg-black/5 flex items-center justify-center text-[18px]">
            <button
              type="button"
              onClick={() => navigate('/hire/profile')}
              className="h-full w-full rounded-full flex items-center justify-center"
              aria-label="Profile"
            >
              👤
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <ModeToggle
            isEarnMode={appMode === 'earn'}
            onToggle={(nextEarnMode) => {
              // OFF=Hire, ON=Earn
              if (nextEarnMode) setAppModeAndPersist('earn')
              else setAppModeAndPersist('hire')
              // App-level fade + redirect handled in App.jsx
              // Toggle toast is handled in ModeToggle itself.
            }}
          />
        </div>

        <div className="mt-4">
          <FestivalBanner />
        </div>
      </div>

      <div className="flex-1 px-5 pb-24">
        {searchQuery.trim().length ? null : (
          <>
            <div className="mt-2 text-[18px] font-extrabold text-black">
              What do you need today?
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
          {HIRE_CATEGORIES.map((c) => {
            const selected = activeCat === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(`/hire/browse?category=${c.id}`)}
                className={[
                  'rounded-3xl bg-white border px-3 py-4 flex flex-col items-center justify-center gap-2',
                  'shadow-[0_12px_25px_rgba(124,58,237,0.10)]',
                  selected
                    ? 'border-[color:var(--primary)]'
                    : 'border-black/10',
                ].join(' ')}
              >
                <img
                  src={categoryPhoto(c.id)}
                  alt={c.label}
                  className="w-[56px] h-[56px] rounded-2xl object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="text-[13px] font-extrabold text-black/80 mt-1">
                  {c.label}
                </div>
              </button>
            )
          })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

