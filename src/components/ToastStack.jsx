import React from 'react'
import { useAppState } from '../state/AppState'

export default function ToastStack() {
  const { toasts } = useAppState()
  if (!toasts.length) return null

  return (
    <div className="fixed z-[60] left-1/2 top-4 w-[92%] max-w-[375px] -translate-x-1/2">
      <div className="flex flex-col items-center gap-2">
        {toasts.slice(-3).map((t) => (
          <div
            key={t.id}
            className="w-full rounded-2xl bg-[color:var(--bg)] shadow-lg ring-1 ring-[color:var(--border)] px-4 py-3 text-center"
          >
            <div className="text-[15px] font-semibold text-[color:var(--text-h)]">
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

