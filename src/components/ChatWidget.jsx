import React, { useMemo, useRef, useState } from 'react'
import { useAppState } from '../state/AppState'
import { describeLanguage } from '../utils/languages'

const DEFAULT_CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-20250514'

function clampTo3Lines(text) {
  const normalized = String(text ?? '').replace(/\r\n/g, '\n').trim()
  if (!normalized) return ''

  const existingLines = normalized.split('\n').map((l) => l.trim())
  if (existingLines.filter(Boolean).length > 1) {
    return existingLines.filter(Boolean).slice(0, 3).join('\n')
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/)
  return sentences.slice(0, 3).join('\n')
}

export default function ChatWidget() {
  const { appMode, selectedLanguage, claudeApiKey, pushToast, isEarnMode } =
    useAppState()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! Ask me anything about SheBuilds.',
    },
  ])
  const [isSending, setIsSending] = useState(false)
  const recognitionRef = useRef(null)

  const languageLabel = useMemo(
    () => describeLanguage(selectedLanguage),
    [selectedLanguage]
  )

  const suggestedPrompts = useMemo(() => {
    if (isEarnMode) {
      return [
        'Which job suits me today?',
        'What should I charge?',
        'How to improve Ghar Score?',
      ]
    }
    return [
      'Who is best for Mehendi near me?',
      'What is fair price for cooking?',
      'Is Sunita available tomorrow?',
    ]
  }, [isEarnMode])

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      pushToast({
        message: 'Voice input not supported in this browser',
        durationMs: 2200,
      })
      return
    }

    const langMap = {
      english: 'en-US',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      telugu: 'te-IN',
    }

    try {
      recognitionRef.current?.abort?.()
    } catch {
      // ignore
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = langMap[selectedLanguage] || 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0]?.transcript)
        .join(' ')
      setInput(transcript.trim())
    }

    recognition.onerror = () => {
      pushToast({ message: 'Voice input failed', durationMs: 2000 })
    }

    recognition.onend = () => {
      // no-op; user can press Send
    }

    recognition.start()
    pushToast({ message: 'Listening... 🎤', durationMs: 1200 })
  }

  const sendToClaude = async (text) => {
    const key = claudeApiKey
    if (!key) {
      pushToast({
        message: 'Add Claude API key in Settings to enable AI',
        durationMs: 3200,
      })
      return
    }

    const apiUrl =
      import.meta.env.VITE_CLAUDE_API_URL || DEFAULT_CLAUDE_API_URL

    const system = [
      `You are SheBuilds’s friendly AI assistant.`,
      `Mode: ${appMode === 'earn' ? 'EARN' : 'HIRE'}.`,
      `Respond in ${languageLabel}. Use simple, warm language.`,
      `Max 3 lines. Keep each line short.`,
    ].join('\n')

    const payload = {
      model: DEFAULT_MODEL,
      max_tokens: 220,
      system,
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`Claude request failed: ${res.status} ${errText}`)
    }

    const data = await res.json()
    const raw =
      data?.content?.[0]?.text ||
      data?.content?.[0]?.type ||
      data?.message?.content ||
      ''
    return clampTo3Lines(raw)
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isSending) return

    setIsSending(true)
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])

    try {
      const reply = await sendToClaude(text)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply || 'Sorry, I could not answer.' },
      ])
    } catch {
      pushToast({
        message: 'AI call failed. Check API key & network.',
        durationMs: 3200,
      })
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I couldn’t reach the AI right now.',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="pointer-events-none fixed z-[55] right-3 bottom-[96px] w-[320px] max-w-[92%]">
      <div className="pointer-events-auto">
        {!open ? (
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-white shadow-lg"
              onClick={() => {
                setOpen(true)
                startVoice()
              }}
              aria-label="Voice input"
              title="Voice input"
            >
              🎤
            </button>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-white shadow-lg"
              onClick={() => setOpen(true)}
              aria-label="Open AI chat"
            >
              🤖
            </button>
          </div>
        ) : (
          <div className="rounded-3xl bg-[color:var(--bg)] shadow-2xl ring-1 ring-[color:var(--border)] overflow-hidden">
            <div className="flex items-center justify-between gap-2 px-4 py-3 bg-black/5">
              <div className="flex items-center gap-2">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'color-mix(in srgb, var(--primary) 20%, transparent)' }}
                >
                  🤖
                </div>
                <div className="text-left">
                  <div className="text-[14px] font-extrabold text-[color:var(--text-h)]">
                    SheBuilds AI
                  </div>
                  <div className="text-[12px] text-[color:var(--text)]">
                    {isEarnMode ? 'Earn Mode' : 'Hire Mode'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full flex items-center justify-center bg-[color:var(--primary)] text-white shadow"
                  onClick={startVoice}
                  aria-label="Voice input"
                  title="Voice input"
                >
                  🎤
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full flex items-center justify-center bg-black/10"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="max-h-[260px] overflow-auto px-4 py-3 flex flex-col gap-2">
              {messages.map((m, idx) => (
                <div
                  key={`${m.role}_${idx}`}
                  className={[
                    'rounded-2xl px-3 py-2 text-[13px] leading-[1.25]',
                    m.role === 'user'
                      ? 'bg-[color:var(--primary)] text-white self-end'
                      : 'bg-black/5 text-[color:var(--text-h)] self-start',
                  ].join(' ')}
                >
                  {m.content}
                </div>
              ))}
              {suggestedPrompts.length > 0 && (
                <div className="pt-2">
                  <div className="text-[12px] font-bold text-[color:var(--text)] mb-2">
                    Quick asks
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="rounded-full bg-black/5 px-3 py-1 text-[12px] font-bold"
                        onClick={() => {
                          setInput(p)
                          setOpen(true)
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-black/10 bg-white">
              <div className="flex gap-2 items-end">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  className="flex-1 resize-none rounded-2xl border border-black/10 bg-[color:var(--bg)] px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  placeholder="Ask SheBuilds AI..."
                />
                <button
                  type="button"
                  className="h-[44px] w-[54px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold shadow"
                  onClick={handleSend}
                  disabled={isSending}
                >
                  {isSending ? '...' : '➤'}
                </button>
              </div>
              <div className="text-[11px] text-[color:var(--text)] mt-2 text-left">
                Responses are simplified to 3 lines.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

