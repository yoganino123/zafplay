// Pengenal angka tulisan tangan (multi-stroke) berbasis algoritma $P point-cloud.
// Tidak memerlukan library / internet. Akurasi meningkat dengan sampel tulisan pemain.
import { getSamples } from './storage.js'

const N = 32
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

function pathLength(p) {
  let d = 0
  for (let i = 1; i < p.length; i++) if (p[i].id === p[i - 1].id) d += dist(p[i - 1], p[i])
  return d
}

function resample(points, n) {
  const pts = points.map((p) => ({ ...p }))
  const I = pathLength(pts) / (n - 1)
  const out = [{ ...pts[0] }]
  let D = 0
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].id !== pts[i - 1].id) continue
    const d = dist(pts[i - 1], pts[i])
    if (I > 0 && D + d >= I) {
      const t = (I - D) / d
      const q = {
        x: pts[i - 1].x + t * (pts[i].x - pts[i - 1].x),
        y: pts[i - 1].y + t * (pts[i].y - pts[i - 1].y),
        id: pts[i].id,
      }
      out.push(q)
      pts.splice(i, 0, q)
      D = 0
    } else D += d
  }
  while (out.length < n) out.push({ ...pts[pts.length - 1] })
  return out.slice(0, n)
}

function normalize(pts) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const p of pts) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y)
  }
  const s = Math.max(maxX - minX, maxY - minY) || 1
  const sc = pts.map((p) => ({ x: (p.x - minX) / s, y: (p.y - minY) / s, id: p.id }))
  const cx = sc.reduce((a, p) => a + p.x, 0) / sc.length
  const cy = sc.reduce((a, p) => a + p.y, 0) / sc.length
  return sc.map((p) => ({ x: p.x - cx, y: p.y - cy, id: p.id }))
}

// strokes: array of array of {x,y}
function preprocess(strokes) {
  const flat = []
  strokes.forEach((s, id) => s.forEach((p) => flat.push({ x: p.x, y: p.y, id })))
  if (!flat.length) return null
  return normalize(resample(flat, N))
}

function cloudDistance(a, b, start) {
  const matched = new Array(N).fill(false)
  let sum = 0
  let i = start
  do {
    let min = Infinity, idx = -1
    for (let j = 0; j < N; j++) {
      if (matched[j]) continue
      const d = dist(a[i], b[j])
      if (d < min) { min = d; idx = j }
    }
    matched[idx] = true
    sum += (1 - ((i - start + N) % N) / N) * min
    i = (i + 1) % N
  } while (i !== start)
  return sum
}

function greedyMatch(a, b) {
  const step = Math.floor(Math.pow(N, 0.5))
  let min = Infinity
  for (let i = 0; i < N; i += step) {
    min = Math.min(min, cloudDistance(a, b, i), cloudDistance(b, a, i))
  }
  return min
}

/* ---------- Template bawaan ---------- */
const arc = (cx, cy, rx, ry, a0, a1, n = 16) => {
  const out = []
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
    out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)])
  }
  return out
}

// Setiap digit: daftar varian; setiap varian: daftar goresan; goresan: daftar titik [x,y]
const DEFS = {
  0: [[arc(0.5, 0.5, 0.5, 0.5, 270, 630, 28)]],
  1: [
    [[[0.5, 0], [0.5, 1]]],
    [[[0.25, 0.25], [0.5, 0], [0.5, 1]]],
  ],
  2: [[[...arc(0.5, 0.3, 0.4, 0.28, 180, 390, 14), [0.1, 1], [0.95, 1]]]],
  3: [[[...arc(0.5, 0.25, 0.38, 0.25, 200, 450, 12), ...arc(0.5, 0.75, 0.42, 0.25, 270, 520, 14)]]],
  4: [
    [[[0.7, 1], [0.7, 0], [0.05, 0.7], [0.95, 0.7]]],
    [[[0.2, 0], [0.1, 0.65], [0.9, 0.65]], [[0.7, 0.2], [0.7, 1]]],
  ],
  5: [[[[0.85, 0], [0.2, 0], [0.15, 0.45], ...arc(0.5, 0.7, 0.42, 0.3, 250, 500, 14)]]],
  6: [[[[0.8, 0.05], [0.45, 0.25], [0.15, 0.55], [0.1, 0.68]], arc(0.5, 0.68, 0.4, 0.32, 0, 360, 24)]],
  7: [[[[0.1, 0], [0.9, 0], [0.65, 0.5], [0.4, 1]]]],
  8: [
    [arc(0.5, 0.25, 0.33, 0.25, 0, 360, 20), arc(0.5, 0.75, 0.4, 0.25, 0, 360, 20)],
    // 8 satu goresan (bentuk "S" lalu menutup)
    [[...arc(0.5, 0.27, 0.32, 0.25, 330, 150, 12), ...arc(0.5, 0.74, 0.4, 0.26, 240, -80, 16)]],
  ],
  9: [
    [arc(0.5, 0.3, 0.38, 0.3, 0, 360, 22), [[0.88, 0.3], [0.85, 0.65], [0.7, 1]]],
    // ekor lurus ke bawah
    [arc(0.5, 0.3, 0.38, 0.3, 0, 360, 22), [[0.88, 0.3], [0.88, 1]]],
    // satu goresan: lingkaran lalu ekor melengkung
    [[...arc(0.5, 0.3, 0.38, 0.3, 60, -300, 22), [0.88, 0.35], [0.82, 0.75], [0.55, 1], [0.3, 0.95]]],
  ],
}

const BUILTIN = []
for (const [digit, variants] of Object.entries(DEFS)) {
  for (const strokes of variants) {
    const st = strokes.map((s) => s.map(([x, y]) => ({ x: x * 0.6, y })))
    BUILTIN.push({ digit, pts: preprocess(st), user: false })
  }
}

/* ---------- Template dari tulisan pemain ---------- */
const userCache = {}
export function invalidateUser(uid) {
  delete userCache[uid]
}
function userTemplates(uid) {
  if (!uid) return []
  if (!userCache[uid]) {
    const samples = getSamples(uid)
    const list = []
    for (const [digit, arr] of Object.entries(samples)) {
      for (const strokes of arr) {
        const pts = preprocess(strokes.map((s) => s.map(([x, y]) => ({ x, y }))))
        if (pts) list.push({ digit, pts, user: true })
      }
    }
    userCache[uid] = list
  }
  return userCache[uid]
}

// Pasangan angka yang sering tertukar pada tulisan anak-anak.
const CONFUSABLE = {
  0: '69', 1: '7', 2: '7', 3: '58', 4: '9', 5: '368', 6: '058', 7: '12', 8: '9036', 9: '804',
}
const MARGIN = 1.35

// hint (opsional): angka yang diharapkan. Jika tebakan terbaik adalah angka yang mirip
// dan jarak ke angka yang diharapkan hampir sama dekat, anggap anak menulis angka yang diharapkan.
export function recognizeStrokes(strokes, uid, hint) {
  const cand = preprocess(strokes)
  if (!cand) return '?'
  let best = '?', bd = Infinity
  const per = {}
  for (const t of [...BUILTIN, ...userTemplates(uid)]) {
    const d = greedyMatch(cand, t.pts) * (t.user ? 0.85 : 1)
    if (d < (per[t.digit] ?? Infinity)) per[t.digit] = d
    if (d < bd) { bd = d; best = t.digit }
  }
  if (hint && hint !== best && CONFUSABLE[best]?.includes(hint) && per[hint] <= bd * MARGIN) return hint
  return best
}

/* ---------- Pisahkan coretan menjadi per-angka ---------- */
export function groupStrokes(strokes, expectedLen) {
  const items = strokes
    .filter((s) => s.length)
    .map((s) => {
      const xs = s.map((p) => p.x)
      return { strokes: [s], minX: Math.min(...xs), maxX: Math.max(...xs) }
    })
    .sort((a, b) => a.minX - b.minX)
  const groups = []
  for (const it of items) {
    const g = groups[groups.length - 1]
    if (g && it.minX <= g.maxX) {
      g.strokes.push(...it.strokes)
      g.maxX = Math.max(g.maxX, it.maxX)
    } else groups.push({ ...it })
  }
  while (groups.length > expectedLen && groups.length > 1) {
    let bi = 0, bg = Infinity
    for (let i = 0; i < groups.length - 1; i++) {
      const gap = groups[i + 1].minX - groups[i].maxX
      if (gap < bg) { bg = gap; bi = i }
    }
    const a = groups[bi], b = groups[bi + 1]
    groups.splice(bi, 2, {
      strokes: [...a.strokes, ...b.strokes],
      minX: a.minX,
      maxX: Math.max(a.maxX, b.maxX),
    })
  }
  return groups
}
