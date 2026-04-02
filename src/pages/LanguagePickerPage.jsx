import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'

const LANGS = [
  { id: 'english', flag: '🇬🇧', label: 'English' },
  { id: 'hindi', flag: '🇮🇳', label: 'हिंदी' },
  { id: 'tamil', flag: '🇮🇳', label: 'தமிழ்' },
  { id: 'telugu', flag: '🇮🇳', label: 'తెలుగు' },
]

export default function LanguagePickerPage() {
  const navigate = useNavigate()
  const { appMode, selectedLanguage, setSelectedLanguageAndPersist } =
    useAppState()
  const [selected, setSelected] = useState(selectedLanguage)

  const homePath = appMode === 'earn' ? '/earn/home' : '/hire/home'

  const canContinue = useMemo(() => !!selected, [selected])

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div className="p-5 pt-10 flex-1">
        <div className="text-[26px] font-extrabold tracking-tight">
          Choose Your Language 💬
        </div>
        <div className="mt-2 text-[14px] text-black/60 font-semibold">
          You can change this anytime in Settings.
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {LANGS.map((l) => {
            const isActive = l.id === selected
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelected(l.id)}
                className={[
                  'rounded-3xl border px-4 py-5 text-left',
                  'transition-all duration-300',
                  isActive
                    ? 'border-[color:var(--primary)] bg-[color:var(--accent-bg)]'
                    : 'border-black/10 bg-white',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[24px]">{l.flag}</div>
                  {isActive ? (
                    <div className="text-[18px]">✅</div>
                  ) : (
                    <div className="text-[18px] invisible">✅</div>
                  )}
                </div>
                <div className="mt-3 text-[14px] font-extrabold">{l.label}</div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          disabled={!canContinue}
          onClick={() => {
            setSelectedLanguageAndPersist(selected)
            navigate(homePath)
          }}
          className="mt-8 h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg w-full disabled:opacity-60"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

