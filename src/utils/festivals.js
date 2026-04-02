const FESTIVALS = [
  {
    id: 'ugadi',
    name: 'Ugadi Special Earnings! 🥭',
    // Demo date per spec: 2 April 2026
    match: { month: 3, day: 2 }, // JS month: 0=Jan
    bannerBg: 'linear-gradient(90deg, rgba(251, 191, 36, 0.35), rgba(34, 197, 94, 0.25))',
    overlayA: '#FBBF24',
    overlayB: '#22C55E',
  },
  {
    id: 'diwali',
    name: 'Diwali Special Savings! 🪔',
    match: { month: 9, day: 1 },
    bannerBg: 'linear-gradient(90deg, rgba(245, 158, 11, 0.4), rgba(234, 179, 8, 0.25))',
    overlayA: '#F59E0B',
    overlayB: '#FDE047',
  },
  {
    id: 'eid',
    name: 'Eid Mubarak Earnings! 🌙',
    match: { month: 5, day: 10 },
    bannerBg: 'linear-gradient(90deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.25))',
    overlayA: '#6D28D9',
    overlayB: '#A855F7',
  },
  {
    id: 'christmas',
    name: 'Christmas Earnings! 🎄',
    match: { month: 11, day: 25 },
    bannerBg: 'linear-gradient(90deg, rgba(239, 68, 68, 0.35), rgba(34, 197, 94, 0.25))',
    overlayA: '#EF4444',
    overlayB: '#22C55E',
  },
  {
    id: 'valentines',
    name: 'Valentine Special! 💕',
    match: { month: 1, day: 14 },
    bannerBg: 'linear-gradient(90deg, rgba(236, 72, 153, 0.38), rgba(251, 113, 133, 0.25))',
    overlayA: '#EC4899',
    overlayB: '#FB7185',
  },
  {
    id: 'independence',
    name: 'Independence Day Specials! 🇮🇳',
    match: { month: 7, day: 15 },
    bannerBg:
      'linear-gradient(90deg, rgba(234, 179, 8, 0.30), rgba(34, 197, 94, 0.25), rgba(239, 68, 68, 0.20))',
    overlayA: '#16A34A',
    overlayB: '#F97316',
  },
]

export function getFestivalForDate(date) {
  const month = date.getMonth()
  const day = date.getDate()
  return (
    FESTIVALS.find((f) => f.match.month === month && f.match.day === day) || null
  )
}

// "Today" festival based on the current device date.
// (If you test on 2 April 2026, Ugadi will be active as specified.)
export function getDemoTodayFestival() {
  return getFestivalForDate(new Date())
}

