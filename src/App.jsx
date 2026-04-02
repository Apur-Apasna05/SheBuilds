import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { AppStateProvider, useAppState } from './state/AppState'
import { LanguageProvider } from './state/LanguageContext'
import ToastStack from './components/ToastStack'
import ChatWidget from './components/ChatWidget'

import SplashPage from './pages/SplashPage'
import LoginPage from './pages/LoginPage'
import LanguagePickerPage from './pages/LanguagePickerPage'
import SettingsPage from './pages/SettingsPage'

import HireHomePage from './pages/hire/HireHomePage'
import HireBrowsePage from './pages/hire/HireBrowsePage'
import HireWorkerDetailPage from './pages/hire/HireWorkerDetailPage'
import HirePaymentPage from './pages/hire/HirePaymentPage'
import HireTrackPage from './pages/hire/HireTrackPage'
import HireBookingsPage from './pages/hire/HireBookingsPage'
import HireNotificationsPage from './pages/hire/HireNotificationsPage'
import HireProfilePage from './pages/hire/HireProfilePage'
import HireWishlistPage from './pages/hire/HireWishlistPage'

import EarnHomePage from './pages/earn/EarnHomePage'
import EarnLearnPage from './pages/earn/EarnLearnPage'
import EarnChitFundPage from './pages/earn/EarnChitFundPage'
import EarnStoresPage from './pages/earn/EarnStoresPage'
import EarnVendorsPage from './pages/earn/EarnVendorsPage'
import EarnProfilePage from './pages/earn/EarnProfilePage'
import EarnPostPage from './pages/earn/EarnPostPage'
import EarnCommunityPage from './pages/earn/EarnCommunityPage'
import EarnWalletPage from './pages/earn/EarnWalletPage'
import EarnOrdersPage from './pages/earn/EarnOrdersPage'

function ModeFadeOverlay({ isFading }) {
  return (
    <div
      className={[
        'fixed inset-0 z-[50] bg-white transition-opacity duration-300',
        isFading ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ].join(' ')}
    />
  )
}

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { appMode, rootStyle } = useAppState()
  const [isFading, setIsFading] = useState(false)
  const prevModeRef = useRef(appMode)

  useEffect(() => {
    if (prevModeRef.current === appMode) return

    const nextPath = appMode === 'earn' ? '/earn/home' : '/hire/home'
    const tFade = window.setTimeout(() => {
      setIsFading(true)
    }, 0)

    const t = window.setTimeout(() => {
      navigate(nextPath, { replace: true })
      setIsFading(false)
    }, 300)

    return () => {
      window.clearTimeout(t)
      window.clearTimeout(tFade)
    }
  }, [appMode, navigate])

  useEffect(() => {
    prevModeRef.current = appMode
  }, [appMode])

  return (
    <div style={rootStyle} className="transition-colors duration-300 min-h-[100svh] bg-white">
      <ModeFadeOverlay isFading={isFading} />
      <ToastStack />
      <ChatWidget />

      <Routes location={location}>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/language" element={<LanguagePickerPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Hire */}
        <Route path="/hire/home" element={<HireHomePage />} />
        <Route path="/hire/browse" element={<HireBrowsePage />} />
        <Route path="/hire/worker/:id" element={<HireWorkerDetailPage />} />
        <Route path="/hire/payment" element={<HirePaymentPage />} />
        <Route path="/hire/track" element={<HireTrackPage />} />
        <Route path="/hire/bookings" element={<HireBookingsPage />} />
        <Route path="/hire/notifications" element={<HireNotificationsPage />} />
        <Route path="/hire/profile" element={<HireProfilePage />} />
        <Route path="/hire/wishlist" element={<HireWishlistPage />} />

        {/* Earn */}
        <Route path="/earn/home" element={<EarnHomePage />} />
        <Route path="/earn/learn" element={<EarnLearnPage />} />
        <Route path="/earn/chit-fund" element={<EarnChitFundPage />} />
        <Route path="/earn/stores" element={<EarnStoresPage />} />
        <Route path="/earn/vendors" element={<EarnVendorsPage />} />
        <Route path="/earn/profile" element={<EarnProfilePage />} />
        <Route path="/earn/post" element={<EarnPostPage />} />
        <Route path="/earn/community" element={<EarnCommunityPage />} />
        <Route path="/earn/wallet" element={<EarnWalletPage />} />
        <Route path="/earn/orders" element={<EarnOrdersPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppStateProvider>
    </LanguageProvider>
  )
}
