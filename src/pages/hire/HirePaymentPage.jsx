import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../state/AppState'
import BottomNav from '../../components/BottomNav'
import QRCode from 'react-qr-code'

export default function HirePaymentPage() {
  const navigate = useNavigate()
  const { pushToast } = useAppState()
  const QR = QRCode?.default || QRCode
  const bookingCreatedRef = useRef(false)

  const draft = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem('activeHireBookingDraft') || 'null')
    } catch {
      return null
    }
  }, [])

  const [confirmed, setConfirmed] = useState(false)
  const [upiSheetOpen, setUpiSheetOpen] = useState(false)
  const [upiProcessing, setUpiProcessing] = useState(false)

  const upiId = 'priya@oksbi'
  const qrValue = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    draft?.workerName || 'Recipient'
  )}&am=${encodeURIComponent(draft?.total || 0)}&cu=INR`

  const saveTransaction = (method) => {
    try {
      const raw = window.localStorage.getItem('transactions') || '[]'
      const arr = JSON.parse(raw)
      const existing = Array.isArray(arr) ? arr : []
      const tx = {
        id: `tx-${Date.now()}`,
        amount: draft.total,
        to: draft.workerName || upiId,
        status: 'success',
        method,
        createdAt: Date.now(),
      }
      window.localStorage.setItem('transactions', JSON.stringify([tx, ...existing]))
    } catch {
      // ignore storage errors
    }
  }

  const createBooking = () => {
    const bookingId = `bk-${Date.now()}`
    const newBooking = {
      id: bookingId,
      workerId: draft.workerId,
      workerName: draft.workerName,
      skill: draft.skill,
      dateLabel: 'Upcoming',
      slotLabel: draft.slotLabel,
      amount: draft.total,
      status: 'upcoming',
    }
    const existing = JSON.parse(window.localStorage.getItem('hireBookings') || '[]')
    window.localStorage.setItem('hireBookings', JSON.stringify([...existing, newBooking]))
  }

  const handlePaymentSuccess = (method) => {
    if (bookingCreatedRef.current) return
    bookingCreatedRef.current = true
    saveTransaction(method)
    createBooking()
    setConfirmed(true)
    pushToast({ message: 'Payment Successful 🎉', durationMs: 2200 })
  }

  if (!draft) {
    return (
      <div className="p-5">
        <div className="text-black/60 font-bold">No booking draft found.</div>
        <button
          className="mt-4 h-[56px] rounded-full bg-[color:var(--primary)] text-white font-extrabold w-full"
          onClick={() => navigate('/hire/home')}
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-[44px] w-[44px] rounded-full bg-black/5 flex items-center justify-center font-extrabold"
          aria-label="Back"
        >
          ←
        </button>

        <div className="mt-4 text-[20px] font-extrabold">Payment</div>

        <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[16px] font-extrabold">
                {draft.workerName} - {draft.skill}
              </div>
              <div className="mt-1 text-[13px] text-black/60 font-semibold">
                {draft.hours} hours • {draft.slotLabel}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-black/60">
                Total
              </div>
              <div className="text-[20px] font-extrabold">₹{draft.total}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setUpiSheetOpen(true)}
              className="flex-1 h-[52px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold shadow-lg hover:opacity-90 active:opacity-80"
            >
              Pay via UPI
            </button>
            <button
              type="button"
              onClick={() => handlePaymentSuccess('Wallet')}
              className="flex-1 h-[52px] rounded-2xl bg-black/5 border border-black/10 text-black/70 font-extrabold hover:bg-black/10 active:bg-black/20"
            >
              Wallet
            </button>
          </div>
        </div>

        {upiSheetOpen ? (
          <div className="fixed inset-0 z-[80] bg-white/95 backdrop-blur">
            <div className="px-5 pt-5 pb-24 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="text-[18px] font-extrabold">UPI Payment</div>
                <button
                  type="button"
                  onClick={() => {
                    if (upiProcessing) return
                    setUpiSheetOpen(false)
                  }}
                  className="h-[40px] w-[40px] rounded-full bg-black/5 font-extrabold"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 rounded-3xl border border-black/10 bg-white p-4">
                <div className="text-[14px] text-black/70 font-semibold">
                  Pay ₹{draft.total} to <span className="font-extrabold text-black/80">{draft.workerName}</span>
                </div>
                <div className="mt-2 text-[13px] font-extrabold text-black/60">
                  UPI ID: {upiId}
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <div className="rounded-2xl bg-black/5 p-4">
                    <QR value={qrValue} size={132} />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => pushToast({ message: 'Opening QR scan…', durationMs: 1600 })}
                    disabled={upiProcessing}
                    className="flex-1 h-[52px] rounded-2xl bg-black/5 text-black/70 font-extrabold border border-black/10 disabled:opacity-60"
                  >
                    Scan QR 📷
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (upiProcessing) return
                      setUpiProcessing(true)
                      window.setTimeout(() => {
                        setUpiProcessing(false)
                        setUpiSheetOpen(false)
                        handlePaymentSuccess('UPI')
                      }, 1500)
                    }}
                    disabled={upiProcessing}
                    className="flex-1 h-[52px] rounded-2xl bg-[color:var(--primary)] text-white font-extrabold shadow-lg disabled:opacity-60"
                  >
                    {upiProcessing ? 'Processing…' : 'Pay Now ✅'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {confirmed && (
          <div className="mt-4 flex flex-col gap-3 items-stretch">
            <div className="rounded-3xl border border-black/10 bg-black/5 p-4 flex items-center gap-3">
              <div className="text-[26px]">✅</div>
              <div>
                <div className="text-[16px] font-extrabold">Payment Successful 🎉</div>
                <div className="text-[13px] text-black/60 font-semibold">
                  You can track the booking status anytime.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/hire/track')}
              className="h-[56px] rounded-full bg-black/5 text-black/70 font-extrabold"
            >
              Track Booking →
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

