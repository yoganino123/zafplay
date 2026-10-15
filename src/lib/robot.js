// Data Garasi Robot: slot bagian, tingkat, dan harga.
export const SLOTS = [
  { id: 'head', name: 'Kepala', emoji: '🤖' },
  { id: 'body', name: 'Badan', emoji: '🛡️' },
  { id: 'armL', name: 'Lengan Kiri', emoji: '💪' },
  { id: 'armR', name: 'Lengan Kanan', emoji: '🦾' },
  { id: 'legs', name: 'Kaki', emoji: '🦿' },
  { id: 'back', name: 'Punggung', emoji: '🚀' },
  { id: 'weapon', name: 'Senjata', emoji: '🔫' },
  { id: 'core', name: 'Inti Energi', emoji: '⚡' },
]

// index = tingkat (0 = belum punya)
export const TIERS = [
  { name: 'Belum ada', color: '#475569', price: 0 },
  { name: 'Biasa', color: '#94a3b8', price: 8 },
  { name: 'Keren', color: '#38bdf8', price: 25 },
  { name: 'Epik', color: '#c084fc', price: 60 },
  { name: 'Legendaris', color: '#fbbf24', price: 120 },
]
export const MAX_TIER = TIERS.length - 1

export const nextPrice = (tier) => (tier >= MAX_TIER ? null : TIERS[tier + 1].price)
export const coinsFor = (score, record) => score + (record ? 5 : 0)
export const totalTiers = (robot = {}) => SLOTS.reduce((a, s) => a + (robot[s.id] || 0), 0)
export const MAX_TOTAL = SLOTS.length * MAX_TIER
