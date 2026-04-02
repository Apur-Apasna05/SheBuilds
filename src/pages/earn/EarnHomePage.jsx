import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../state/AppState'
import { JOB_POSTS } from '../../data/dummyData'
import ModeToggle from '../../components/ModeToggle'
import FestivalBanner from '../../components/FestivalBanner'
import BottomNav from '../../components/BottomNav'
import { workerPhoto } from '../../utils/unsplash'

export default function EarnHomePage() {
  const navigate = useNavigate()
  const { isEarnMode, setAppModeAndPersist, pushToast, claudeApiKey } = useAppState()
  const [graniteOpen, setGraniteOpen] = useState(false)

  const acceptedCount = useMemo(() => {
    const raw = window.localStorage.getItem('earnOrders') || '[]'
    try {
      const arr = JSON.parse(raw)
      return Array.isArray(arr) ? arr.length : 0
    } catch {
      return 0
    }
  }, [])

  const GRANITE_ENDPOINT = 'https://api.anthropic.com/v1/messages'
  const GRANITE_MODEL = 'claude-sonnet-4-20250514'

  const jobSkillOptions = [
    'Mehendi Artist',
    'Stitching',
    'Art / Craft',
    'Pickle Making',
    'Cooking',
    'Kids Tutor',
    'Hair / Makeup',
    'Sales Person',
  ]

  const [jobSkillCategory, setJobSkillCategory] = useState(jobSkillOptions[0])
  const [rawJobInput, setRawJobInput] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [formattedJob, setFormattedJob] = useState('')
  const [isGraniteLoading, setIsGraniteLoading] = useState(false)

  useEffect(() => {
    if (!graniteOpen) return
    // Auto-generate job description when skill category changes.
    // Provide a graceful fallback if no API key is provided.
    if (!claudeApiKey) {
      setJobDescription(
        'Select a category and add your job details. Paste raw input, then format using IBM Granite AI.'
      )
      return
    }

    let cancelled = false
    const generate = async () => {
      setIsGraniteLoading(true)
      try {
        const res = await fetch(GRANITE_ENDPOINT, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: GRANITE_MODEL,
            max_tokens: 350,
            system:
              'You are IBM Granite AI for a women work app in India. Generate short, clear job descriptions in simple language.',
            messages: [
              {
                role: 'user',
                content: `Skill category selected: ${jobSkillCategory}\n\nGenerate a job description (2-3 sentences) suitable for employers hiring women. Include what they should do, work location type, and expected duration if possible.`,
              },
            ],
          }),
        })
        if (!res.ok) throw new Error(`Granite generation failed: ${res.status}`)
        const data = await res.json()
        const text = data?.content?.[0]?.text || ''
        if (!cancelled) setJobDescription(text || '')
      } catch {
        if (!cancelled) {
          setJobDescription(
            `Looking for an experienced ${jobSkillCategory} for a family function. Work location: home visit. Expected duration: 3 hours.`
          )
        }
      } finally {
        if (!cancelled) setIsGraniteLoading(false)
      }
    }

    generate()
    return () => {
      cancelled = true
    }
  }, [graniteOpen, jobSkillCategory, claudeApiKey])

  const formatJob = async (inputText) => {
    if (!claudeApiKey) {
      pushToast({
        message: 'Add Claude API key in Settings to enable IBM Granite AI',
        durationMs: 3300,
      })
      return ''
    }
    setIsGraniteLoading(true)
    try {
      const raw = String(inputText || '').trim()
      const res = await fetch(GRANITE_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: GRANITE_MODEL,
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Format this job posting professionally for a women's work app in India. Return clean structured text:\n"${raw}"`,
            },
          ],
        }),
      })
      if (!res.ok) {
        const t = await res.text().catch(() => '')
        throw new Error(`Granite format failed: ${res.status} ${t}`)
      }
      const data = await res.json()
      const text = data?.content?.[0]?.text || ''
      return text
    } finally {
      setIsGraniteLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-[20px]">👑</div>
            <div className="text-[18px] font-extrabold">SheBuilds</div>
          </div>
          <div className="flex-1 flex justify-center">
            <button
              type="button"
              className="h-[44px] w-[44px] rounded-full bg-black/5 text-[18px]"
              onClick={() => pushToast({ message: 'Search is coming soon', durationMs: 1600 })}
              aria-label="Search"
            >
              🔍
            </button>
          </div>
          <button
            type="button"
            className="h-[44px] w-[44px] rounded-full bg-black/5 flex items-center justify-center text-[18px]"
            onClick={() => navigate('/earn/profile')}
            aria-label="Profile"
          >
            👤
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <ModeToggle
            isEarnMode={isEarnMode}
            onToggle={(nextEarnMode) => {
              setAppModeAndPersist(nextEarnMode ? 'earn' : 'hire')
            }}
          />
        </div>

        <div className="mt-4">
          <FestivalBanner />
        </div>

        <div className="mt-4 rounded-3xl bg-[linear-gradient(90deg,rgba(255,45,120,0.28),rgba(124,58,237,0.12))] border border-pink-200/40 p-4">
          <div className="text-[18px] font-extrabold">Namaste Priya! 👋</div>
          <div className="mt-1 text-[14px] font-semibold text-black/70">
            You can earn ₹500 today! 💰
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pb-24">
        <div className="mt-4 text-[18px] font-extrabold">Find jobs</div>
        <div className="mt-2 flex flex-col gap-3">
          {JOB_POSTS.map((j) => (
            <div
              key={j.id}
              className="rounded-3xl bg-white border border-black/10 shadow-[0_12px_25px_rgba(255,45,120,0.10)] p-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={workerPhoto(j.id)}
                  alt={j.skill}
                  className="w-[88px] h-[72px] rounded-2xl object-cover border border-black/5"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="text-[18px] font-extrabold">{j.skill}</div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    Due: {j.due} • ₹{j.pricePerHr}/hr
                  </div>
                  <div className="mt-1 text-[13px] text-black/60 font-semibold">
                    {j.employer} • {j.distanceKm}km
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (j.fixed) {
                      // still allow accept, but show toast
                    }
                    const order = {
                      id: `ord-${Date.now()}`,
                      jobId: j.id,
                      skill: j.skill,
                      due: j.due,
                      pricePerHr: j.pricePerHr,
                      employer: j.employer,
                    }
                    const existing = JSON.parse(
                      window.localStorage.getItem('earnOrders') || '[]'
                    )
                    window.localStorage.setItem(
                      'earnOrders',
                      JSON.stringify([...existing, order])
                    )
                    pushToast({ message: 'Accepted ✓', durationMs: 1800 })
                  }}
                  className="flex-1 h-[46px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold text-[13px]"
                >
                  Accept ✓
                </button>
                <button
                  type="button"
                  onClick={() => pushToast({ message: 'Connecting you to the employer... 📞', durationMs: 1600 })}
                  className="flex-1 h-[46px] rounded-2xl bg-black/5 font-extrabold text-black/70 text-[13px]"
                >
                  Contact 📞
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-3"
            onClick={() => setGraniteOpen((p) => !p)}
          >
            <div className="flex items-center gap-3">
              <div className="text-[28px]">🤖</div>
              <div className="text-[16px] font-extrabold">IBM Granite AI</div>
            </div>
            <div className="text-[13px] font-extrabold text-[color:var(--primary)]">
              {graniteOpen ? 'Hide' : 'Show'}
            </div>
          </button>

          <div
            className={[
              'mt-3 rounded-2xl p-3 border',
              'bg-[linear-gradient(90deg,rgba(255,45,120,0.18),rgba(124,58,237,0.08))]',
              'border-pink-200/50',
              graniteOpen ? 'block' : 'hidden',
            ].join(' ')}
          >
            <div className="text-[14px] font-bold text-black/70">
              IBM Granite AI
            </div>
            <div className="mt-2 text-[12px] font-semibold text-black/60">
              {isGraniteLoading ? 'Thinking...' : `3 jobs match your skills today!`}
            </div>

            <div className="mt-4 rounded-2xl bg-white border border-black/10 p-3">
              <div className="text-[14px] font-extrabold">Post a job</div>
              <div className="mt-1 text-[12px] text-black/60 font-semibold">
                Format with IBM Granite AI after filling details.
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <label className="text-[12px] font-bold text-black/60">
                  Skill category
                </label>
                <select
                  value={jobSkillCategory}
                  onChange={(e) => setJobSkillCategory(e.target.value)}
                  className="h-[52px] rounded-2xl border border-black/10 bg-white px-4 outline-none focus:ring-2 focus:ring-[color:var(--primary)] font-extrabold text-[13px]"
                >
                  {jobSkillOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label className="text-[12px] font-bold text-black/60">
                  Editable job description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[13px] font-semibold text-black/70"
                  placeholder="Generated description will appear here..."
                />

                <label className="text-[12px] font-bold text-black/60">
                  Raw input (for structured formatting)
                </label>
                <textarea
                  value={rawJobInput}
                  onChange={(e) => setRawJobInput(e.target.value)}
                  rows={3}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[13px] font-semibold text-black/70"
                  placeholder='e.g. need cook tomorrow morning biryani'
                />

                <button
                  type="button"
                  onClick={async () => {
                    const textToFormat = (rawJobInput || jobDescription || '').trim()
                    if (!textToFormat) {
                      pushToast({
                        message: 'Add raw input first',
                        durationMs: 2000,
                      })
                      return
                    }
                    const out = await formatJob(textToFormat)
                    if (out) setFormattedJob(out)
                  }}
                  className="mt-2 h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
                  disabled={isGraniteLoading}
                >
                  Format with IBM Granite AI
                </button>

                {formattedJob && (
                  <div className="mt-2 rounded-2xl bg-black/5 border border-black/10 p-3">
                    <div className="text-[12px] font-extrabold text-black/70">
                      Formatted output
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap text-[13px] font-semibold text-black/70">
                      {formattedJob}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-[12px] font-semibold text-black/60">
              You already accepted {acceptedCount} jobs.
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

