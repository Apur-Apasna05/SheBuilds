import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'
import { LANGUAGES } from '../utils/languages'

export default function SettingsPage() {
  const navigate = useNavigate()
  const {
    appMode,
    autoMode,
    setAutoModeAndPersist,
    selectedLanguage,
    setSelectedLanguageAndPersist,
    claudeApiKey,
    setClaudeApiKeyAndPersist,
  } = useAppState()

  const [localKey, setLocalKey] = useState(claudeApiKey)

  const homePath = appMode === 'earn' ? '/earn/home' : '/hire/home'

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div className="p-5 pt-10 flex-1">
        <div className="text-[28px] font-extrabold">Settings ⚙️</div>
        <div className="mt-2 text-[14px] font-semibold text-black/60">
          Auto themes, language & safety.
        </div>

        <div className="mt-6 rounded-3xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[16px] font-extrabold">Auto Mode 🪄</div>
              <div className="text-[12px] text-black/60 font-semibold">
                Festival themes overlay on Home.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoModeAndPersist(!autoMode)}
              className={[
                'relative w-[74px] h-[40px] rounded-full transition-colors duration-300',
                autoMode ? 'bg-[color:var(--primary)]' : 'bg-black/15',
              ].join(' ')}
            >
              <div
                className={[
                  'absolute top-[5px] left-[5px] w-[30px] h-[30px] rounded-full bg-white shadow transition-transform duration-300',
                  autoMode ? 'translate-x-[34px]' : 'translate-x-0',
                ].join(' ')}
              />
              <div className="sr-only">{autoMode ? 'ON' : 'OFF'}</div>
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="text-[16px] font-extrabold">Language</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {LANGUAGES.map((l) => {
              const active = l.id === selectedLanguage
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLanguageAndPersist(l.id)}
                  className={[
                    'rounded-2xl border px-3 py-3 text-left',
                    active
                      ? 'border-[color:var(--primary)] bg-[color:var(--accent-bg)]'
                      : 'border-black/10 bg-white',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[22px]">{l.flag}</div>
                    <div className="text-[16px]">{active ? '✅' : ' '}</div>
                  </div>
                  <div className="mt-1 text-[13px] font-extrabold">{l.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="text-[16px] font-extrabold">Safety settings</div>
          <div className="mt-3 flex flex-col gap-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-black/70">
                Hide phone number
              </span>
              <input type="checkbox" defaultChecked className="accent-[color:var(--primary)]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-black/70">
                Show “Available” only to nearby
              </span>
              <input type="checkbox" defaultChecked className="accent-[color:var(--primary)]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-bold text-black/70">
                Enable emergency shortcut
              </span>
              <input type="checkbox" defaultChecked className="accent-[color:var(--primary)]" />
            </label>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="text-[16px] font-extrabold">Claude API (optional)</div>
          <div className="mt-2 text-[12px] font-semibold text-black/60">
            Paste your API key to enable the AI chat bubble.
          </div>
          <input
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="Claude API key (x-api-key header)"
            className="mt-3 w-full h-[48px] rounded-2xl border border-black/10 px-4 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[14px]"
          />
          <button
            type="button"
            onClick={() => setClaudeApiKeyAndPersist(localKey)}
            className="mt-3 h-[52px] w-full rounded-full bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
          >
            Save key
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(homePath)}
          className="mt-6 h-[56px] rounded-full bg-black/5 text-black/70 font-extrabold"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

