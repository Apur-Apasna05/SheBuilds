/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const translations = {
  english: {
    home: 'Home',
    findJobs: 'Find Jobs',
    learnSkills: 'Learn Skills',
    chitFund: 'Chit Fund',
    profile: 'Profile',
    searchPlaceholder: 'Search skills...',
    bookNow: 'Book Now',
    accept: 'Accept',
    contact: 'Contact',
    wallet: 'My Wallet',
    earnings: 'My Earnings',
    available: 'Available',
    booked: 'Booked',
    payNow: 'Pay Now',
    recentBookings: 'Recent Bookings',
    vendorSupport: 'Vendor Support',
    findStores: 'Find Stores Near You',
    welcome: 'Welcome',
    switchMode: 'Switch Mode',
  },
  hindi: {
    home: 'होम',
    findJobs: 'काम खोजें',
    learnSkills: 'कौशल सीखें',
    chitFund: 'चिट फंड',
    profile: 'प्रोफाइल',
    searchPlaceholder: 'कौशल खोजें...',
    bookNow: 'अभी बुक करें',
    accept: 'स्वीकार करें',
    contact: 'संपर्क करें',
    wallet: 'मेरा वॉलेट',
    earnings: 'मेरी कमाई',
    available: 'उपलब्ध',
    booked: 'बुक हो गया',
    payNow: 'अभी भुगतान करें',
    recentBookings: 'हाल की बुकिंग',
    vendorSupport: 'विक्रेता सहायता',
    findStores: 'पास की दुकानें',
    welcome: 'नमस्ते',
    switchMode: 'मोड बदलें',
  },
  tamil: {
    home: 'முகப்பு',
    findJobs: 'வேலை தேடு',
    learnSkills: 'திறன் கற்று',
    chitFund: 'சிட்டி ஃபண்ட்',
    profile: 'சுயவிவரம்',
    searchPlaceholder: 'திறன்களை தேடு...',
    bookNow: 'இப்போது முன்பதிவு',
    accept: 'ஏற்கவும்',
    contact: 'தொடர்பு',
    wallet: 'என் வாலட்',
    earnings: 'என் வருமானம்',
    available: 'கிடைக்கும்',
    booked: 'முன்பதிவு',
    payNow: 'இப்போது செலுத்து',
    recentBookings: 'சமீபத்திய முன்பதிவுகள்',
    vendorSupport: 'விற்பனையாளர் ஆதரவு',
    findStores: 'அருகில் உள்ள கடைகள்',
    welcome: 'வணக்கம்',
    switchMode: 'மோடை மாற்று',
  },
  telugu: {
    home: 'హోమ్',
    findJobs: 'పని వెతుకు',
    learnSkills: 'నైపుణ్యం నేర్చుకో',
    chitFund: 'చిట్ ఫండ్',
    profile: 'ప్రొఫైల్',
    searchPlaceholder: 'నైపుణ్యాలు వెతుకు...',
    bookNow: 'ఇప్పుడు బుక్ చేయి',
    accept: 'అంగీకరించు',
    contact: 'సంప్రదించు',
    wallet: 'నా వాలెట్',
    earnings: 'నా సంపాదన',
    available: 'అందుబాటులో',
    booked: 'బుక్ అయింది',
    payNow: 'ఇప్పుడు చెల్లించు',
    recentBookings: 'ఇటీవలి బుకింగ్‌లు',
    vendorSupport: 'విక్రేత సహాయం',
    findStores: 'దగ్గర దుకాణాలు',
    welcome: 'నమస్కారం',
    switchMode: 'మోడ్ మార్చు',
  },
}

function initLanguage() {
  try {
    const v = window.localStorage.getItem('selectedLanguage')
    if (v && translations[v]) return v
  } catch {
    // ignore
  }
  // Default always: english
  return 'english'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initLanguage)

  const t = useMemo(() => {
    return (key) => {
      const dict = translations[language] || translations.english
      return dict[key] || translations.english[key] || key
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next) => {
        setLanguage(next)
        try {
          window.localStorage.setItem('selectedLanguage', next)
        } catch {
          // ignore
        }
      },
      t,
      translations,
    }),
    [language, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const v = useContext(LanguageContext)
  if (!v) throw new Error('useLanguage must be used inside LanguageProvider')
  return v
}

export { translations }

