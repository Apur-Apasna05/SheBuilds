export const LANGUAGES = [
  { id: 'english', label: 'English', flag: '🇬🇧' },
  { id: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
  { id: 'tamil', label: 'தமிழ்', flag: '🇮🇳' },
  { id: 'telugu', label: 'తెలుగు', flag: '🇮🇳' },
]

export function describeLanguage(id) {
  const found = LANGUAGES.find((l) => l.id === id)
  return found?.label || 'English'
}

