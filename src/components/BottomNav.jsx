import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppState } from '../state/AppState'

const HIRE_TABS = [
  { to: '/hire/home', label: 'Home', icon: '🏠' },
  { to: '/hire/wishlist', label: 'Wishlist', icon: '🔔' },
  { to: '/hire/notifications', label: 'Notify', icon: '🔔' },
  { to: '/hire/bookings', label: 'Bookings', icon: '📋' },
  { to: '/hire/profile', label: 'Profile', icon: '👤' },
]

const EARN_TABS = [
  { to: '/earn/home', label: 'Home', icon: '🏠' },
  { to: '/earn/learn', label: 'Learn', icon: '📚' },
  { to: '/earn/chit-fund', label: 'Chit Fund', icon: '💰' },
  { to: '/earn/community', label: 'Community', icon: '🤝' },
  { to: '/earn/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  const { appMode } = useAppState()
  const tabs = appMode === 'earn' ? EARN_TABS : HIRE_TABS

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[40]">
      <div className="bg-white/95 backdrop-blur border-t border-black/5">
        <div className="mx-auto w-full max-w-[375px] px-1">
          <div className="flex justify-between">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-1"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={[
                        'text-[18px] leading-none',
                        isActive
                          ? 'text-[color:var(--primary)]'
                          : 'text-black/40',
                      ].join(' ')}
                    >
                      {t.icon}
                    </div>
                    <div
                      className={[
                        'text-[11px] font-bold',
                        isActive
                          ? 'text-[color:var(--primary)]'
                          : 'text-black/35',
                      ].join(' ')}
                    >
                      {t.label}
                    </div>
                    <div
                      className={[
                        'h-[6px] w-[22px] rounded-full transition-opacity',
                        isActive ? 'bg-[color:var(--primary)]' : 'bg-transparent',
                      ].join(' ')}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

