import React, { useEffect } from 'react'

export default function BottomSheet({
  open,
  title,
  imageUrl,
  subtitle,
  lines = [],
  actions = [],
  onClose,
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute left-0 right-0 bottom-0 rounded-t-3xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="w-[52px] h-[52px] rounded-2xl object-cover border border-black/5"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <div>
              <div className="text-[16px] font-extrabold">{title}</div>
              {subtitle ? (
                <div className="text-[12px] text-black/60 font-semibold mt-1">
                  {subtitle}
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] w-[40px] rounded-full bg-black/5 text-black/70 font-extrabold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {lines.length ? (
          <div className="px-5 pb-4 flex flex-col gap-2">
            {lines.map((l, idx) => (
              <div key={idx} className="text-[13px] text-black/70 font-semibold">
                {l}
              </div>
            ))}
          </div>
        ) : null}

        {actions.length ? (
          <div className="px-5 pb-5 flex gap-2">
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className={[
                  'flex-1 h-[56px] rounded-2xl font-extrabold text-[13px]',
                  a.variant === 'primary'
                    ? 'bg-[color:var(--primary)] text-white'
                    : 'bg-black/5 text-black/70 border border-black/10',
                ].join(' ')}
              >
                {a.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

