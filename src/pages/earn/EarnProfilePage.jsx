import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pie, PieChart, Cell } from 'recharts'
import QRCode from 'react-qr-code'
import BottomNav from '../../components/BottomNav'
import { useAppState } from '../../state/AppState'

const PRIMARY_PINK = '#FF2D78'
const ROSE = '#FB7185'

function downloadSvgFromEl(svgEl, filename) {
  if (!svgEl) return
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgEl)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function EarnProfilePage() {
  const navigate = useNavigate()
  const { pushToast } = useAppState()
  const QR = QRCode?.default || QRCode

  const qrRef = useRef(null)
  const [userUPI, setUserUPI] = useState(() => {
    try {
      return window.localStorage.getItem('userUPI') || 'priya@oksbi'
    } catch {
      return 'priya@oksbi'
    }
  })
  const [isEditingUPI, setIsEditingUPI] = useState(false)
  const [upiDraft, setUpiDraft] = useState(userUPI)

  useEffect(() => {
    setUpiDraft(userUPI)
  }, [userUPI])

  const qrValue = useMemo(() => {
    return `upi://pay?pa=${encodeURIComponent(userUPI)}&pn=${encodeURIComponent(
      'SheBuilds'
    )}&am=0&cu=INR`
  }, [userUPI])

  const earningsPie = useMemo(() => {
    return [
      { name: 'Earned', value: 25 },
      { name: 'Remaining', value: 5 },
    ]
  }, [])

  const [autoModeOn, setAutoModeOn] = useState(true)
  const [notificationsOn, setNotificationsOn] = useState(true)
  const [safetyZoneKm, setSafetyZoneKm] = useState(2)

  const [userPosts, setUserPosts] = useState([])
  const [activePostId, setActivePostId] = useState(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('userPosts') || '[]'
      const arr = JSON.parse(raw)
      setUserPosts(Array.isArray(arr) ? arr : [])
    } catch {
      setUserPosts([])
    }
  }, [])

  const sortedPosts = useMemo(() => {
    const arr = [...userPosts]
    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return arr
  }, [userPosts])

  const activePost = useMemo(() => {
    if (!activePostId) return null
    return sortedPosts.find((p) => p.id === activePostId) || null
  }, [activePostId, sortedPosts])

  const deletePost = (postId) => {
    const next = sortedPosts.filter((p) => p.id !== postId)
    setUserPosts(next)
    window.localStorage.setItem('userPosts', JSON.stringify(next))
    setActivePostId(null)
  }

  useEffect(() => {
    try {
      window.localStorage.setItem('userUPI', userUPI)
    } catch {
      // ignore
    }
  }, [userUPI])

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">My Profile</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Earn Mode 🌸
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

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_25px_rgba(255,45,120,0.08)]">
          <div className="flex flex-col items-center">
            <img
              src="https://source.unsplash.com/400x400/?ai,woman,portrait"
              alt="AI Generated Woman"
              className="w-[96px] h-[96px] rounded-full object-cover border border-black/5"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-[20px] font-extrabold">Priya Reddy</div>
            <div className="mt-1 text-[13px] text-black/60 font-semibold text-center">
              📍 Dilsukhnagar, Hyderabad
            </div>
            <div className="mt-2 text-[14px] font-extrabold text-black/70 text-center">
              ⭐ Ghar Score: 4.8/5
            </div>
            <div className="mt-2 inline-flex items-center rounded-full px-4 py-2 bg-[color:var(--primary)]/10 border border-[color:var(--primary)]/30">
              <span className="text-[12px] font-extrabold text-[color:var(--primary)]">
                🌸 Earn Mode Active
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[13px] font-extrabold text-black/70">MY SKILLS</div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <button className="px-4 py-2 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-[13px] hover:opacity-90 active:opacity-80">
                Stitching
              </button>
              <button className="px-4 py-2 rounded-full bg-black/5 text-black/70 font-extrabold text-[13px] hover:bg-black/10 active:bg-black/20">
                Cooking
              </button>
              <button className="px-4 py-2 rounded-full bg-black/5 text-black/70 font-extrabold text-[13px] border border-black/10 hover:bg-black/10 active:bg-black/20">
                [+Add]
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[13px] font-extrabold text-black/70">EARNINGS OVERVIEW</div>
            <div className="mt-2 text-[13px] text-black/60 font-semibold">
              Total Earned: ₹25,000
            </div>
            <div className="mt-1 text-[13px] text-black/60 font-semibold">
              This Month: ₹4,500
            </div>

            <div className="mt-3 flex items-center justify-center relative">
              <div className="w-[210px] h-[210px]">
                <PieChart width={210} height={210}>
                  <Pie
                    data={earningsPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={78}
                    outerRadius={104}
                    stroke="none"
                  >
                    {earningsPie.map((entry, idx) => (
                      <Cell key={entry.name} fill={idx === 0 ? PRIMARY_PINK : ROSE} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="absolute text-center">
                <div className="text-[16px] font-extrabold">₹25,000 earned 🎉</div>
                <div className="text-[12px] font-bold text-black/60 mt-1">This is your goal</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-[13px] font-extrabold text-black/70">✨ My Work Showcase</div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/earn/post')}
            className="mt-2 w-full h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg hover:opacity-90 active:opacity-80"
          >
            + Post Your Work
          </button>

          <div className="mt-3 rounded-3xl border border-black/10 bg-white p-4">
            {sortedPosts.length === 0 ? (
              <div className="text-center text-black/60 font-bold py-6">
                No posts yet. Upload your first work ✨
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {sortedPosts.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePostId(p.id)}
                    className="rounded-xl overflow-hidden border border-black/10 bg-white text-left"
                  >
                    <div className="w-full aspect-square bg-black/5">
                      <img
                        src={p.image}
                        alt={p.caption || 'Work'}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2">
                      <div className="text-[12px] font-extrabold text-black/70 whitespace-pre-wrap line-clamp-2">
                        {p.caption || 'Untitled'}
                      </div>
                      {typeof p.price === 'number' ? (
                        <div className="mt-1 text-[12px] font-extrabold text-black">
                          ₹{p.price}
                        </div>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {activePost ? (
            <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur">
              <div className="px-5 pt-5 pb-24 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="text-[18px] font-extrabold">Work Details</div>
                  <button
                    type="button"
                    onClick={() => setActivePostId(null)}
                    className="h-[40px] w-[40px] rounded-full bg-black/5 font-extrabold"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-4 rounded-3xl overflow-hidden border border-black/10 bg-black/5">
                  <img
                    src={activePost.image}
                    alt={activePost.caption || 'Work'}
                    className="w-full max-h-[320px] object-cover"
                  />
                </div>

                <div className="mt-4">
                  <div className="text-[14px] font-extrabold text-black/70">
                    {activePost.caption || 'Untitled'}
                  </div>
                  <div className="mt-2 text-[13px] text-black/60 font-semibold">
                    Category: {activePost.category || '—'}
                  </div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    Price:{' '}
                    {typeof activePost.price === 'number' ? `₹${activePost.price}` : '—'}
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => deletePost(activePost.id)}
                    className="w-full h-[56px] rounded-full bg-red-500/10 text-red-600 font-extrabold border border-red-500/30"
                  >
                    Delete ❌
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[13px] font-extrabold text-black/70">💰 RECEIVE PAYMENTS</div>
            <div className="mt-2 text-[13px] font-semibold text-black/60">
              Your UPI ID
            </div>

            <div className="mt-3 flex items-center gap-2">
              {isEditingUPI ? (
                <>
                  <input
                    value={upiDraft}
                    onChange={(e) => setUpiDraft(e.target.value)}
                    className="flex-1 h-[44px] rounded-2xl border border-black/10 px-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[13px] font-extrabold text-black/70"
                    inputMode="email"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = upiDraft.trim()
                      if (!next) return
                      setUserUPI(next)
                      setIsEditingUPI(false)
                      pushToast({ message: 'UPI ID saved ✅', durationMs: 1800 })
                    }}
                    className="h-[44px] w-[86px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 text-[13px] font-extrabold text-black/70">
                    {userUPI}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingUPI(true)}
                    className="h-[44px] px-3 rounded-2xl bg-black/5 text-black/70 font-extrabold border border-black/10"
                  >
                    Edit UPI ID
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center">
              <div ref={qrRef}>
                <QR value={qrValue} size={132} />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(qrValue)
                    pushToast({ message: 'QR copied to clipboard ✅', durationMs: 1800 })
                  } catch {
                    pushToast({ message: 'Sharing not supported here', durationMs: 2000 })
                  }
                }}
                className="flex-1 h-[52px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold hover:opacity-90 active:opacity-80"
              >
                Share QR
              </button>
              <button
                type="button"
                onClick={() => {
                  const svgEl = qrRef.current?.querySelector('svg')
                  downloadSvgFromEl(svgEl, 'shebuilds-upi-qr.svg')
                }}
                className="flex-1 h-[52px] rounded-2xl bg-black/5 font-extrabold text-black/70 hover:bg-black/10 active:bg-black/20"
              >
                Download QR
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[13px] font-extrabold text-black/70">WALLET BALANCE</div>
            <div className="mt-2 text-[13px] text-black/60 font-semibold">
              Available: ₹2,400
            </div>
            <div className="mt-1 text-[13px] text-black/60 font-semibold">
              Emergency Fund: ₹500 🔒
            </div>
            <button
              type="button"
              onClick={() => navigate('/earn/wallet')}
              className="mt-3 w-full h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg hover:opacity-90 active:opacity-80"
            >
              Cash Out
            </button>
          </div>

          <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
            <div className="text-[13px] font-extrabold text-black/70">SETTINGS</div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('/language')}
                className="text-[13px] text-black/60 font-semibold text-left hover:text-black/70 active:opacity-90"
              >
                Language: English &gt;
              </button>
              <button
                type="button"
                onClick={() => setAutoModeOn((p) => !p)}
                className="text-[13px] text-black/60 font-semibold text-left hover:text-black/70 active:opacity-90"
              >
                Auto Mode: {autoModeOn ? 'ON' : 'OFF'} &gt;
              </button>
              <button
                type="button"
                onClick={() => setSafetyZoneKm((p) => (p === 2 ? 3 : 2))}
                className="text-[13px] text-black/60 font-semibold text-left hover:text-black/70 active:opacity-90"
              >
                Safety Zone: {safetyZoneKm}km &gt;
              </button>
              <button
                type="button"
                onClick={() => setNotificationsOn((p) => !p)}
                className="text-[13px] text-black/60 font-semibold text-left hover:text-black/70 active:opacity-90"
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
                className="mt-2 h-[56px] w-full rounded-full bg-black/5 text-black/70 font-extrabold hover:bg-black/10 active:bg-black/20"
              >
                [Logout]
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

