import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EARN_SKILL_LEARN } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'
import { useAppState } from '../../state/AppState'
import BottomSheet from '../../components/BottomSheet'

const THUMBNAILS = {
  'hair-makeup': 'https://source.unsplash.com/400x200/?hairsalon,woman',
  stitching: 'https://source.unsplash.com/400x200/?sewing,woman',
  art: 'https://source.unsplash.com/400x200/?craft,woman',
  pickle: 'https://source.unsplash.com/400x200/?pickle,food,woman',
}

export default function EarnLearnPage() {
  const navigate = useNavigate()
  const { pushToast } = useAppState()

  const [sheetId, setSheetId] = useState(null)
  const [activeContactId, setActiveContactId] = useState(null)

  const active = useMemo(() => {
    if (!sheetId) return null
    return EARN_SKILL_LEARN.find((s) => s.id === sheetId) || null
  }, [sheetId])

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="rounded-3xl bg-[linear-gradient(90deg,rgba(255,45,120,0.35),rgba(124,58,237,0.18))] p-4 border border-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[22px] font-extrabold">Learn &amp; Earn More 📚</div>
              <div className="mt-1 text-[13px] font-semibold text-black/60">
                Master new skills • Increase your rate
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/earn/home')}
              className="h-[40px] w-[40px] rounded-full bg-white/60 backdrop-blur border border-black/5 text-black/70 font-extrabold"
              aria-label="Back"
            >
              ←
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {EARN_SKILL_LEARN.map((v) => {
            const thumb = THUMBNAILS[v.thumbnailId] || v.thumbnailId
            const isActive = activeContactId === v.id
            return (
              <div
                key={v.id}
                className="rounded-3xl bg-white border border-black/10 shadow-[0_12px_25px_rgba(255,45,120,0.08)] overflow-hidden"
              >
                <img
                  src={thumb}
                  alt={v.title}
                  className="w-full h-[200px] object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[16px] font-extrabold">{v.title}</div>
                    <div className="text-[13px] font-extrabold text-black/60 text-right">
                      ★★★★½ • 4.5k learners
                    </div>
                  </div>

                  <div className="mt-2 text-[13px] text-black/60 font-semibold">
                    Duration: 2 hours
                  </div>

                  <div className="mt-3">
                    <div className="text-[13px] font-semibold text-black/70">
                      👩‍🏫 {v.instructor}
                    </div>
                    <div className="text-[13px] font-semibold text-black/70">
                      📞 {v.phone}
                    </div>
                    <div className="text-[13px] font-semibold text-black/70">
                      📍 {v.location}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        pushToast({
                          message: `Starting ${v.title}...`,
                          durationMs: 1500,
                        })
                      }
                      className="flex-1 h-[52px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold hover:opacity-90 active:opacity-80"
                    >
                      [▶ Watch Free]
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveContactId(v.id)
                        setSheetId(v.id)
                        pushToast({
                          message: `Opening contact for ${v.instructor}`,
                          durationMs: 1800,
                        })
                      }}
                      className={[
                        'flex-1 h-[52px] rounded-2xl font-extrabold border',
                        isActive
                          ? 'bg-[color:var(--primary)] text-white border-transparent'
                          : 'bg-black/5 text-black/70 border-black/10 hover:bg-black/10 active:bg-black/20',
                      ].join(' ')}
                    >
                      [📞 Contact]
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BottomSheet
        open={!!active}
        onClose={() => setSheetId(null)}
        title={active?.instructor || ''}
        subtitle={active?.location || ''}
        imageUrl={active ? THUMBNAILS[active.thumbnailId] : ''}
        lines={
          active
            ? [`📞 ${active.phone}`, `📍 ${active.location}`, `⏰ Open: 9AM - 7PM`]
            : []
        }
        actions={[
          {
            label: '📞 Call Now',
            variant: 'primary',
            onClick: () => {
              const digits = String(active?.phone || '').replace(/\D/g, '')
              if (!digits) return
              window.location.href = `tel:${digits}`
            },
          },
          {
            label: '💬 WhatsApp',
            variant: 'secondary',
            onClick: () => {
              const digits = String(active?.phone || '').replace(/\D/g, '')
              if (!digits) return
              window.open(`https://wa.me/${digits}`, '_blank')
            },
          },
        ]}
      />

      <BottomNav />
    </div>
  )
}

