// Penyimpanan di browser (localStorage) - tanpa database.
const KEY = 'mathkilat_v1'
const SKEY = (uid) => `mathkilat_samples_${uid}`
export const MAX_USERS = 3
const MAX_SAMPLES = 6

export function loadDb() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY))
    if (d && Array.isArray(d.users)) return d
  } catch (e) { /* abaikan */ }
  return { users: [] }
}

export function saveDb(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)) } catch (e) { /* abaikan */ }
}

export function getSamples(uid) {
  try { return JSON.parse(localStorage.getItem(SKEY(uid))) || {} } catch (e) { return {} }
}

export function removeSamples(uid) {
  try { localStorage.removeItem(SKEY(uid)) } catch (e) { /* abaikan */ }
}

// pairs: [{digit:'3', strokes:[[{x,y}...]...]}]
export function addSamples(uid, pairs) {
  const s = getSamples(uid)
  for (const { digit, strokes } of pairs) {
    const compact = strokes.map((st) => st.map((p) => [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10]))
    s[digit] = [...(s[digit] || []), compact].slice(-MAX_SAMPLES)
  }
  try { localStorage.setItem(SKEY(uid), JSON.stringify(s)) } catch (e) { /* abaikan */ }
}
