import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../state/AppState'
import { HIRE_CATEGORIES } from '../../data/dummyData'
import BottomNav from '../../components/BottomNav'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function clampCaption2Lines(text) {
  const t = String(text || '').trim()
  if (!t) return ''
  // Prefer splitting on sentence boundaries.
  const parts = t.split(/(?<=[.!?])\s+/)
  return parts.slice(0, 2).join(' ')
}

export default function EarnPostPage() {
  const navigate = useNavigate()
  const { claudeApiKey, pushToast } = useAppState()

  const categories = useMemo(() => {
    // Map to the labels shown across the app.
    return HIRE_CATEGORIES.map((c) => c.label)
  }, [])

  const [imageData, setImageData] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Stitching')
  const [price, setPrice] = useState('')

  const [isSuggesting, setIsSuggesting] = useState(false)

  const suggestCaption = async () => {
    if (!selectedCategory) return
    if (!claudeApiKey) {
      const fallback = clampCaption2Lines(
        `Beautiful custom-${selectedCategory.toLowerCase()} work ✨ perfect for festive occasions.`
      )
      setCaption((prev) => prev || fallback)
      pushToast({ message: 'Caption suggestion ready', durationMs: 1800 })
      return
    }

    setIsSuggesting(true)
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
          max_tokens: 120,
          system:
            'You are IBM Granite AI. Generate a short 1-2 line caption in simple language for a women work showcase in India. No hashtags, no extra explanations.',
          messages: [
            {
              role: 'user',
              content: `Category: ${selectedCategory}\n\nGenerate caption:`,
            },
          ],
        }),
      })

      if (!res.ok) throw new Error(`Granite failed: ${res.status}`)
      const data = await res.json()
      const raw = data?.content?.[0]?.text || ''
      const out = clampCaption2Lines(raw)
      setCaption((prev) => prev || out)
      pushToast({ message: 'Caption suggested 🤖', durationMs: 1800 })
    } catch {
      const fallback = clampCaption2Lines(
        `Beautiful custom-${selectedCategory.toLowerCase()} work ✨ made with care.`
      )
      setCaption((prev) => prev || fallback)
      pushToast({ message: 'Caption suggestion ready', durationMs: 1800 })
    } finally {
      setIsSuggesting(false)
    }
  }

  const handlePostNow = () => {
    if (!imageData) {
      pushToast({ message: 'Upload a photo first', durationMs: 2000 })
      return
    }

    const parsedPrice = price.trim() ? Number(price) : null

    const newPost = {
      id: `post-${Date.now()}`,
      userId: 'priya',
      userName: 'Priya Reddy',
      image: imageData,
      caption: caption.trim() || '',
      category: selectedCategory,
      price: parsedPrice,
      createdAt: Date.now(),
    }

    const raw = window.localStorage.getItem('userPosts') || '[]'
    const existing = (() => {
      try {
        const arr = JSON.parse(raw)
        return Array.isArray(arr) ? arr : []
      } catch {
        return []
      }
    })()

    window.localStorage.setItem('userPosts', JSON.stringify([newPost, ...existing]))
    pushToast({ message: 'Posted successfully ✨', durationMs: 2200 })
    navigate('/earn/profile')
  }

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div className="text-[20px] font-extrabold">Show Your Work ✨</div>
          <button
            type="button"
            onClick={() => navigate('/earn/profile')}
            className="h-[40px] w-[40px] rounded-full bg-black/5 font-extrabold"
            aria-label="Back"
          >
            ←
          </button>
        </div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="text-[14px] font-extrabold text-black/70 mb-2">
            Upload Photo 📷
          </div>

          <label className="block w-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const b64 = await fileToBase64(file)
                setImageData(b64)
                setPreviewUrl(String(b64))
              }}
            />
            <div className="w-full h-[170px] rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-black/60 font-extrabold">Tap to upload</div>
              )}
            </div>
          </label>

          <div className="mt-3">
            <div className="text-[14px] font-extrabold text-black/70 mb-1">
              Caption (optional)
            </div>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Stitched blouse for wedding"
              className="w-full h-[52px] rounded-2xl border border-black/10 px-4 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[14px] font-semibold text-black/70"
            />
          </div>

          <div className="mt-3">
            <div className="text-[14px] font-extrabold text-black/70 mb-1">
              Select Category
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-[52px] rounded-2xl border border-black/10 px-4 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[14px] font-extrabold text-black/70 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <div className="text-[14px] font-extrabold text-black/70 mb-1">
              Price (optional)
            </div>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
              placeholder="₹150"
              inputMode="numeric"
              className="w-full h-[52px] rounded-2xl border border-black/10 px-4 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[14px] font-semibold text-black/70"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={suggestCaption}
              disabled={isSuggesting}
              className="flex-1 h-[56px] rounded-2xl bg-black/5 border border-black/10 text-black/70 font-extrabold disabled:opacity-60"
            >
              🤖 {isSuggesting ? 'Suggesting...' : 'Suggest Caption'}
            </button>
            <button
              type="button"
              onClick={handlePostNow}
              className="flex-1 h-[56px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold shadow-lg"
            >
              Post Now 🚀
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

