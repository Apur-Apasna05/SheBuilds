import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../state/AppState'
import BottomNav from '../../components/BottomNav'

function clamp2Lines(text) {
  const t = String(text || '').trim()
  if (!t) return ''
  const parts = t.split(/(?<=[.!?])\s+/)
  return parts.slice(0, 2).join(' ')
}

export default function EarnCommunityPage() {
  const navigate = useNavigate()
  const { claudeApiKey, pushToast } = useAppState()

  const [question, setQuestion] = useState('')
  const [posts, setPosts] = useState([])
  const [sortMode, setSortMode] = useState('latest') // latest | liked

  const [replyDraftByPostId, setReplyDraftByPostId] = useState({})
  const [replyOpenPostId, setReplyOpenPostId] = useState(null)

  const [aiReplyDraft, setAiReplyDraft] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('communityPosts') || '[]'
      const arr = JSON.parse(raw)
      setPosts(Array.isArray(arr) ? arr : [])
    } catch {
      setPosts([])
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('communityPosts', JSON.stringify(posts))
    } catch {
      // ignore
    }
  }, [posts])

  const currentUser = { id: 'priya', name: 'Priya Reddy' }

  const displayedPosts = useMemo(() => {
    const arr = [...posts]
    if (sortMode === 'liked') {
      arr.sort((a, b) => (b.likes || 0) - (a.likes || 0) || (b.createdAt || 0) - (a.createdAt || 0))
      return arr
    }
    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    return arr
  }, [posts, sortMode])

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      pushToast({ message: 'Voice input not supported here', durationMs: 2000 })
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'en-IN'
    rec.interimResults = true
    rec.maxAlternatives = 1
    rec.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0]?.transcript).join(' ')
      setQuestion(transcript.trim())
    }
    rec.onerror = () => pushToast({ message: 'Voice input failed', durationMs: 1800 })
    rec.start()
    pushToast({ message: 'Listening... 🎤', durationMs: 1200 })
  }

  const createPost = () => {
    const text = question.trim()
    if (!text) {
      pushToast({ message: 'Write a question or post something first', durationMs: 2000 })
      return
    }

    const userQuestion = text

    let replies = []
    if (aiReplyDraft.trim()) {
      replies = [
        {
          id: `r-${Date.now()}`,
          name: 'IBM Granite AI',
          text: clamp2Lines(aiReplyDraft),
          createdAt: Date.now(),
        },
      ]
    }

    const newPost = {
      id: `p-${Date.now()}`,
      userId: currentUser.id,
      name: currentUser.name,
      text: userQuestion,
      likes: 0,
      likedByMe: false,
      replies,
      createdAt: Date.now(),
    }

    setPosts((prev) => [newPost, ...prev])
    setQuestion('')
    setAiReplyDraft('')
    pushToast({ message: 'Posted successfully ✨', durationMs: 2000 })
  }

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const likedByMe = !p.likedByMe
        const likes = Math.max(0, (p.likes || 0) + (likedByMe ? 1 : -1))
        return { ...p, likedByMe, likes }
      })
    )
  }

  const addReply = (postId) => {
    const draft = String(replyDraftByPostId[postId] || '').trim()
    if (!draft) return
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const nextReplies = [
          ...(p.replies || []),
          { id: `r-${Date.now()}`, name: currentUser.name, text: draft, createdAt: Date.now() },
        ]
        return { ...p, replies: nextReplies }
      })
    )
    setReplyDraftByPostId((prev) => ({ ...prev, [postId]: '' }))
    setReplyOpenPostId(null)
    pushToast({ message: 'Reply added', durationMs: 1400 })
  }

  const getAiSuggestion = async () => {
    const q = question.trim()
    if (!q) {
      pushToast({ message: 'Ask a question first', durationMs: 1800 })
      return
    }
    if (!claudeApiKey) {
      const fallback = clamp2Lines(
        'Try charging based on your experience and local demand. For best results, share details like location and duration.'
      )
      setAiReplyDraft(fallback)
      pushToast({ message: 'AI suggestion ready', durationMs: 1800 })
      return
    }

    setAiLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 220,
          system:
            'You are IBM Granite AI. Provide a helpful, short answer (2-3 lines) for women community questions in India. Simple language. No emojis requirement.',
          messages: [{ role: 'user', content: q }],
        }),
      })
      if (!res.ok) throw new Error(`AI failed: ${res.status}`)
      const data = await res.json()
      const raw = data?.content?.[0]?.text || ''
      const out = clamp2Lines(raw)
      setAiReplyDraft(out)
      pushToast({ message: 'AI Suggestion generated 🤖', durationMs: 2000 })
    } catch {
      setAiReplyDraft(
        clamp2Lines(
          'Share your location and experience. Pricing usually depends on duration and local demand. Start with a fair rate and adjust with results.'
        )
      )
      pushToast({ message: 'AI suggestion ready', durationMs: 2000 })
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[20px] font-extrabold">Women Community 🤝</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Ask • Share • Support each other
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

        <div className="mt-4 rounded-3xl bg-white border border-black/10 p-4 shadow-[0_12px_25px_rgba(255,45,120,0.08)]">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Ask something..."
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[14px] font-semibold text-black/70 resize-none"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={startVoice}
              className="flex-1 h-[52px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold"
            >
              🎤 Voice
            </button>
            <button
              type="button"
              onClick={createPost}
              className="flex-1 h-[52px] rounded-2xl bg-black/5 text-black/70 font-extrabold border border-black/10"
            >
              Post ➤
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={getAiSuggestion}
              disabled={aiLoading}
              className="h-[48px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold disabled:opacity-60"
            >
              🤖 AI Suggestion
            </button>
            {aiReplyDraft ? (
              <div className="rounded-2xl bg-black/5 border border-black/10 p-3">
                <div className="text-[12px] font-extrabold text-black/60">Suggested reply</div>
                <div className="mt-1 text-[13px] font-semibold text-black/70 whitespace-pre-wrap">
                  {aiReplyDraft}
                </div>
                <button
                  type="button"
                  onClick={() => pushToast({ message: 'Will include AI reply when you Post ➤', durationMs: 2000 })}
                  className="mt-2 h-[44px] rounded-2xl bg-white text-black/70 font-extrabold border border-black/10"
                >
                  Add on Post
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setSortMode('latest')}
            className={[
              'flex-1 h-[46px] rounded-2xl font-extrabold text-[13px] border',
              sortMode === 'latest'
                ? 'bg-[color:var(--primary)] text-white border-transparent'
                : 'bg-white text-black/70 border-black/10 hover:bg-black/5 active:bg-black/10',
            ].join(' ')}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => setSortMode('liked')}
            className={[
              'flex-1 h-[46px] rounded-2xl font-extrabold text-[13px] border',
              sortMode === 'liked'
                ? 'bg-[color:var(--primary)] text-white border-transparent'
                : 'bg-white text-black/70 border-black/10 hover:bg-black/5 active:bg-black/10',
            ].join(' ')}
          >
            Most Liked
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {displayedPosts.length === 0 ? (
            <div className="mt-4 rounded-3xl bg-black/5 border border-black/10 p-4 text-center text-black/60 font-bold">
              No community posts yet. Be the first!
            </div>
          ) : null}

          {displayedPosts.map((p) => {
            const replies = p.replies || []
            const replyOpen = replyOpenPostId === p.id
            const authorImg = `https://randomuser.me/api/portraits/women/${(p.createdAt % 90) + 1}.jpg`

            return (
              <div
                key={p.id}
                className="rounded-3xl bg-white border border-black/10 p-4 shadow-[0_12px_25px_rgba(255,45,120,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={authorImg}
                    alt={p.name}
                    className="h-[42px] w-[42px] rounded-full object-cover border border-black/5"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="text-[14px] font-extrabold">{p.name}</div>
                    <div className="mt-1 text-[13px] text-black/70 font-semibold whitespace-pre-wrap">
                      "{p.text}"
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleLike(p.id)}
                        className={[
                          'h-[34px] rounded-full px-3 font-extrabold text-[12px] border',
                          p.likedByMe
                            ? 'bg-[color:var(--primary)] text-white border-transparent'
                            : 'bg-black/5 text-black/70 border-black/10 hover:bg-black/10 active:bg-black/20',
                        ].join(' ')}
                      >
                        👍 {p.likes || 0}
                      </button>
                      <div className="text-[12px] font-extrabold text-black/60">
                        💬 {replies.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyOpenPostId(replyOpen ? null : p.id)}
                    className="flex-1 h-[44px] rounded-2xl bg-black/5 text-black/70 font-extrabold border border-black/10"
                  >
                    Reply
                  </button>
                </div>

                {replyOpen ? (
                  <div className="mt-3 rounded-2xl bg-black/5 border border-black/10 p-3">
                    <textarea
                      value={replyDraftByPostId[p.id] || ''}
                      onChange={(e) =>
                        setReplyDraftByPostId((prev) => ({ ...prev, [p.id]: e.target.value }))
                      }
                      rows={2}
                      className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[13px] font-semibold text-black/70 resize-none"
                      placeholder="Write a reply..."
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => addReply(p.id)}
                        className="flex-1 h-[44px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold"
                      >
                        Post Reply ➤
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyOpenPostId(null)}
                        className="flex-1 h-[44px] rounded-2xl bg-white text-black/70 font-extrabold border border-black/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {replies.length ? (
                  <div className="mt-3 flex flex-col gap-2">
                    {replies.slice(-3).map((r) => (
                      <div
                        key={r.id}
                        className="rounded-2xl bg-white border border-black/10 p-3"
                      >
                        <div className="text-[12px] font-extrabold text-black/60">{r.name}</div>
                        <div className="mt-1 text-[13px] font-semibold text-black/70">
                          {r.text}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

