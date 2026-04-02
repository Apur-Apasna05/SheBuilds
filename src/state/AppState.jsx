/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import { readStorageString, writeStorageString } from '../utils/storage'
import { getDemoTodayFestival } from '../utils/festivals'
import { useLanguage } from './LanguageContext'

const AppStateContext = createContext(null)

function initAppMode() {
  const v = readStorageString('appMode', '')
  if (v === 'earn') return 'earn'
  return 'hire'
}

function initAutoMode() {
  // Stored as 'on'/'off' or boolean-ish.
  const v = readStorageString('autoMode', '')
  if (!v) return false
  return v === 'on' || v === 'true' || v === '1'
}

export function AppStateProvider({ children }) {
  const [appMode, setAppMode] = useState(initAppMode)
  const [autoMode, setAutoMode] = useState(initAutoMode)
  const [claudeApiKey, setClaudeApiKey] = useState(
    readStorageString('claudeApiKey', '')
  )

  const { language, setLanguage } = useLanguage()

  const [toasts, setToasts] = useState([])

  const pushToast = (toast) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, durationMs: 2500, ...toast }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.durationMs ?? 2500)
  }

  const setAppModeAndPersist = (nextMode) => {
    setAppMode(nextMode)
    writeStorageString('appMode', nextMode)
  }

  const setAutoModeAndPersist = (on) => {
    setAutoMode(on)
    writeStorageString('autoMode', on ? 'on' : 'off')
  }

  const setClaudeApiKeyAndPersist = (key) => {
    setClaudeApiKey(key)
    writeStorageString('claudeApiKey', key)
  }

  const isEarnMode = appMode === 'earn'

  const theme = {
    primary: isEarnMode ? '#FF2D78' : '#7C3AED',
    // Keep the spec: OFF=Hire purple; ON=Earn pink.
    secondary: isEarnMode ? '#D81B60' : '#6D28D9',
    accent: isEarnMode ? '#FF2D78' : '#7C3AED',
  }

  const festival = getDemoTodayFestival()

  const rootStyle = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--accent': theme.accent,
    '--festivalA': autoMode && festival ? festival.overlayA : theme.primary,
    '--festivalB': autoMode && festival ? festival.overlayB : theme.primary,
  }

  const value = {
    appMode,
    setAppModeAndPersist,
    isEarnMode,
    selectedLanguage: language,
    setSelectedLanguageAndPersist: setLanguage,
    autoMode,
    setAutoModeAndPersist,
    claudeApiKey,
    setClaudeApiKeyAndPersist,
    theme,
    festival,
    rootStyle,
    toasts,
    pushToast,
  }

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}

export function useAppState() {
  const v = useContext(AppStateContext)
  if (!v) throw new Error('useAppState must be used within AppStateProvider')
  return v
}

