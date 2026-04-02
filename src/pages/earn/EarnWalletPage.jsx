import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import { useAppState } from '../../state/AppState'

export default function EarnWalletPage() {
  const navigate = useNavigate()
  const { pushToast } = useAppState()

  const [balance, setBalance] = useState(() => {
    try {
      const b = Number(window.localStorage.getItem('walletBalance') || '2400')
      return Number.isFinite(b) ? b : 2400
    } catch {
      return 2400
    }
  })
  const emergency = 500

  const [userUPI] = useState(() => {
    try {
      return window.localStorage.getItem('userUPI') || 'priya@oksbi'
    } catch {
      return 'priya@oksbi'
    }
  })
  const [mode, setMode] = useState('upi') // upi | kirana

  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [successText, setSuccessText] = useState('')

  const nearestKirana = useMemo(() => {
    return {
      name: 'Srinivasa Kirana & Provision',
      address: 'Near Dilsukhnagar Metro, Hyderabad',
    }
  }, [])

  const saveTransaction = (method, to) => {
    try {
      const raw = window.localStorage.getItem('transactions') || '[]'
      const arr = JSON.parse(raw)
      const existing = Array.isArray(arr) ? arr : []
      const tx = {
        id: `tx-${Date.now()}`,
        amount: Number(amount),
        to,
        status: 'success',
        method,
        createdAt: Date.now(),
      }
      window.localStorage.setItem('transactions', JSON.stringify([tx, ...existing]))
    } catch {
      // ignore
    }
  }

  const handleTransfer = () => {
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      pushToast({ message: 'Enter a valid amount', durationMs: 1800 })
      return
    }
    if (isProcessing) return

    setIsProcessing(true)
    setSuccessText('')
    window.setTimeout(() => {
      const txTo = mode === 'upi' ? userUPI : nearestKirana.name
      const method = mode === 'upi' ? 'UPI' : 'KIRANA'
      saveTransaction(method, txTo)
      setIsProcessing(false)
      setSuccessText('Transfer Successful 🎉')
      pushToast({ message: 'Done ✅', durationMs: 1600 })
      setBalance((p) => Math.max(0, p - amt))
    }, 1500)
  }

  return (
    <div className="min-h-[100svh] bg-white flex flex-col">
      <div className="px-5 pt-5 pb-24 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-extrabold">Wallet 💰</div>
            <div className="text-[13px] text-black/60 font-semibold mt-1">
              Cash out and emergency fund.
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/earn/profile')}
            className="h-[40px] w-[40px] rounded-full bg-black/5"
            aria-label="Back"
          >
            ←
          </button>
        </div>

        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-4 shadow-[0_12px_25px_rgba(255,45,120,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-bold text-black/60">Available Balance</div>
              <div className="text-[26px] font-extrabold">₹{balance}</div>
            </div>
            <div className="text-[36px] leading-none">💳</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('upi')
                setSuccessText('')
              }}
              className={[
                'h-[68px] rounded-2xl border font-extrabold text-[13px] flex flex-col items-start justify-center px-3',
                mode === 'upi'
                  ? 'bg-[color:var(--primary)] text-white border-transparent'
                  : 'bg-white text-black/70 border-black/10 hover:bg-black/5 active:bg-black/10',
              ].join(' ')}
            >
              <span className="text-[18px] leading-none">💸</span>
              UPI Transfer
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('kirana')
                setSuccessText('')
              }}
              className={[
                'h-[68px] rounded-2xl border font-extrabold text-[13px] flex flex-col items-start justify-center px-3',
                mode === 'kirana'
                  ? 'bg-[color:var(--primary)] text-white border-transparent'
                  : 'bg-white text-black/70 border-black/10 hover:bg-black/5 active:bg-black/10',
              ].join(' ')}
            >
              <span className="text-[18px] leading-none">🏪</span>
              Nearby Kirana
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-3">
            <div className="text-[13px] font-bold text-black/70">
              {mode === 'upi' ? <>To: {userUPI}</> : <>Store: {nearestKirana.name}</>}
            </div>
            <div className="mt-2">
              <div className="text-[12px] font-extrabold text-black/60">Enter amount</div>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                inputMode="numeric"
                placeholder="e.g. 300"
                className="mt-2 w-full h-[48px] rounded-2xl border border-black/10 px-3 outline-none focus:ring-2 focus:ring-[color:var(--primary)] text-[14px] font-semibold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleTransfer}
            disabled={isProcessing}
            className={[
              'mt-4 w-full h-[56px] rounded-full text-white font-extrabold shadow-lg',
              'bg-[color:var(--primary)] hover:opacity-90 active:opacity-80',
              'disabled:opacity-60 disabled:hover:opacity-60',
            ].join(' ')}
          >
            {isProcessing ? 'Processing...' : mode === 'upi' ? 'Transfer' : 'Proceed'}
          </button>

          {successText ? (
            <div className="mt-3 rounded-2xl bg-white border border-black/10 p-3 text-center font-extrabold text-green-700">
              {successText}
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl bg-black/5 p-3">
            <div className="text-[13px] font-bold text-black/70">
              Emergency fund: ₹{emergency} (locked 🔒)
            </div>
            <div className="mt-1 text-[12px] text-black/60 font-semibold">
              Auto save: 5% per earning
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

