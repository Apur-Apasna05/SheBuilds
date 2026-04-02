export const HIRE_CATEGORIES = [
  { id: 'dance', label: 'Dance', emoji: '💃' },
  { id: 'makeup', label: 'Makeup', emoji: '💄' },
  { id: 'stitching', label: 'Stitch', emoji: '🧵' },
  { id: 'cooking', label: 'Cook', emoji: '🍳' },
  { id: 'painting', label: 'Paint', emoji: '🎨' },
  { id: 'tuition', label: 'Tuition', emoji: '📚' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'pickle', label: 'Pickle Making', emoji: '🫙' },
]

export const WORKERS = [
  {
    id: 'priya-reddy',
    name: 'Priya Reddy',
    skill: 'Stitching',
    rating: 4.8,
    location: 'Dilsukhnagar',
    distanceKm: 2,
    pricePerHr: 150,
    availability: 'available', // 'available' | 'booked'
    badges: ['Available 🟢'],
    avatarBg: 'linear-gradient(180deg, rgba(124,58,237,0.35), rgba(124,58,237,0.08))',
    workingHours: '8AM - 6PM',
  },
  {
    id: 'sunita-rao',
    name: 'Sunita Rao',
    skill: 'Mehendi',
    rating: 4.5,
    location: 'Kukatpally',
    distanceKm: 1.6,
    pricePerHr: 200,
    availability: 'available',
    badges: ['Available 🟢'],
    avatarBg: 'linear-gradient(180deg, rgba(255,45,120,0.35), rgba(255,45,120,0.08))',
    workingHours: '10AM - 7PM',
  },
  {
    id: 'fatima-begum',
    name: 'Fatima Begum',
    skill: 'Cooking',
    rating: 4.9,
    location: 'LB Nagar',
    distanceKm: 3.2,
    pricePerHr: 180,
    availability: 'booked',
    badges: ['Booked 🔴'],
    avatarBg: 'linear-gradient(180deg, rgba(124,58,237,0.22), rgba(0,0,0,0.02))',
    workingHours: '9AM - 5PM',
  },
  {
    id: 'ananya-krishna',
    name: 'Ananya Krishna',
    skill: 'Tuition',
    rating: 4.7,
    location: 'Uppal',
    distanceKm: 2.1,
    pricePerHr: 200,
    availability: 'available',
    badges: ['Available 🟢'],
    avatarBg: 'linear-gradient(180deg, rgba(124,58,237,0.25), rgba(124,58,237,0.06))',
    workingHours: '7AM - 4PM',
  },
  {
    id: 'lakshmi-devi',
    name: 'Lakshmi Devi',
    skill: 'Painting',
    rating: 4.3,
    location: 'Miyapur',
    distanceKm: 4.4,
    pricePerHr: 120,
    availability: 'available',
    badges: ['Available 🟢'],
    avatarBg: 'linear-gradient(180deg, rgba(124,58,237,0.18), rgba(124,58,237,0.06))',
    workingHours: '9AM - 6PM',
  },
  {
    id: 'ritu-sharma',
    name: 'Ritu Sharma',
    skill: 'Dance',
    rating: 4.6,
    location: 'Madhapur',
    distanceKm: 2.7,
    pricePerHr: 250,
    availability: 'available',
    badges: ['Available 🟢'],
    avatarBg: 'linear-gradient(180deg, rgba(124,58,237,0.26), rgba(124,58,237,0.06))',
    workingHours: '6AM - 3PM',
  },
]

export const HIRE_FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'dance', label: 'Dance' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'stitching', label: 'Stitching' },
]

export const HIRE_WORKER_TIME_SLOTS = [
  { id: '8-10', label: '8-10 AM', hours: 2 },
  { id: '5-9', label: '5-9 PM', hours: 4 },
  { id: '9-12', label: '9-12 PM', hours: 3 },
]

export const HIRE_BOOKING_HISTORY = [
  { id: 'bk-priya-2026-04-20', workerId: 'priya-reddy', workerName: 'Priya Reddy', skill: 'Stitching', dateLabel: '20 April', slotLabel: '8-10 AM', amount: 300, status: 'completed', rating: 5 },
  { id: 'bk-fatima-2026-02-28', workerId: 'fatima-begum', workerName: 'Fatima Begum', skill: 'Mehendi', dateLabel: '28 Feb', slotLabel: '—', amount: 800, status: 'completed', rating: 4 },
  { id: 'bk-sunita-2026-03-05', workerId: 'sunita-rao', workerName: 'Sunita Rao', skill: 'Cooking', dateLabel: '5 Mar', slotLabel: '—', amount: 360, status: 'completed', rating: 4 },
]

export const HIRE_NOTIFICATIONS = [
  { id: 'n1', emoji: '🟣', text: 'Priya accepted your request!' },
  { id: 'n2', emoji: '🟢', text: 'Sunita is on her way' },
  { id: 'n3', emoji: '⭐', text: 'Rate your last booking' },
  { id: 'n4', emoji: '🎉', text: 'Ugadi Special — Book a cook today!' },
]

export const DUMMY_USER = {
  name: 'Priya',
  phone: '9XXXXXXXXX',
  location: 'Dilsukhnagar',
}

// Earn-mode job posts
export const JOB_POSTS = [
  { id: 'job-stitching-1', skill: 'Stitching Job', due: '20/04/26', pricePerHr: 150, employer: 'Rahul Boutique', distanceKm: 2, emoji: '🧵', fixed: false },
  { id: 'job-mehendi-1', skill: 'Mehendi Artist / Makeup', due: '28/04/26', pricePerHr: 200, employer: 'Wedding Hall', distanceKm: 1.5, emoji: '💅', fixed: true },
  { id: 'job-cooking-1', skill: 'Cooking Dishes', due: '30/04/26', pricePerHr: 180, employer: 'Sharma Family', distanceKm: 3, emoji: '🍳', fixed: false },
  { id: 'job-store-sales-1', skill: 'Sales Person', due: 'Ongoing', pricePerHr: 100, employer: 'Kirana Store', distanceKm: 1.2, emoji: '🧾', fixed: false },
  { id: 'job-tutor-1', skill: 'Kids Tutor', due: 'Daily', pricePerHr: 200, employer: 'Gupta Family', distanceKm: 2.4, emoji: '📚', fixed: false },
]

export const STORE_LIST = [
  { id: 'store-1', name: 'Anand Fashion Boutique', location: 'Jubilee Hills', note: 'Helper needed', pricePerHr: 120, emoji: '🏪' },
  { id: 'store-2', name: 'Kirana Store', location: 'Road No.5', note: 'Sales Person', pricePerHr: 100, emoji: '🛒' },
]

export const VENDOR_LIST = [
  { id: 'vendor-1', name: 'Ramu Chili Factory', location: 'Dilsukhnagar', phone: '9849XXXXXX', emoji: '🌶️' },
  { id: 'vendor-2', name: 'Makeup Products Wholesale', location: 'LB Nagar', phone: '9876XXXXXX', emoji: '💄' },
]

export const CHIT_FUND = {
  monthlyPaid: [true, true, true, false, false, false], // Jan..Jun
  currentMonthIndex: 3, // Apr
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  membersCount: 10,
  monthlyContribution: 1000,
  poolPerMonth: 10000,
  yourTurnLabel: 'Month 7',
  dueNowLabel: '₹1,000 due this month',
  targetLabel: '₹25,000',
}

export const EARN_SKILL_LEARN = [
  {
    id: 'learn-1',
    title: 'Hair / Makeup Tutorial',
    thumbnailId: 'hair-makeup',
    instructor: 'Neha Sharma',
    phone: '9849XXXXXX',
    location: 'Kukatpally, Hyderabad',
  },
  {
    id: 'learn-2',
    title: 'Stitching',
    thumbnailId: 'stitching',
    instructor: 'Rama Devi',
    phone: '9876XXXXXX',
    location: 'Kukatpally, Hyderabad',
  },
  {
    id: 'learn-3',
    title: 'Art / Craft',
    thumbnailId: 'art',
    instructor: 'Sunita Reddy',
    phone: '9123XXXXXX',
    location: 'Kukatpally, Hyderabad',
  },
  {
    id: 'learn-4',
    title: 'Pickle Making',
    thumbnailId: 'pickle',
    instructor: 'Lakshmi Bai',
    phone: '9456XXXXXX',
    location: 'Kukatpally, Hyderabad',
  },
]

