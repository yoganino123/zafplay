import { useRef, useState } from 'react'
import Pad from './Pad.jsx'
import { addSamples } from '../lib/storage.js'
import { invalidateUser } from '../lib/recognizer.js'

const ROUND = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const DIGITS = [...ROUND, ...ROUND] // 2 putaran agar contoh tulisan lebih banyak

// Pemain menulis angka 0-9 dua kali agar tebakan lebih akurat untuk gaya tulisannya.
export default function Calibrate({ user, onDone }) {
  const padRef = useRef(null)
  const [i, setI] = useState(0)
  const [hasInk, setHasInk] = useState(false)

  const next = () => {
    const strokes = padRef.current.getStrokes()
    if (!strokes.length) return
    addSamples(user.id, [{ digit: DIGITS[i], strokes }])
    invalidateUser(user.id)
    padRef.current.clear()
    setHasInk(false)
    if (i + 1 >= DIGITS.length) onDone()
    else setI(i + 1)
  }

  return (
    <div className="screen center calib">
      <h2>Latih tulisanku ✍️</h2>
      <p className="sub">Tulis angka berikut ({i + 1}/{DIGITS.length})</p>
      <div className="target">{DIGITS[i]}</div>
      <div className="canvas-wrap calib-pad">
        {!hasInk && <div className="hint">Tulis di sini</div>}
        <Pad ref={padRef} width={10} color="#312e81" onStrokeStart={() => setHasInk(true)} />
      </div>
      <div className="row">
        <button className="btn ghost" onClick={onDone}>Selesai</button>
        <button className="btn ghost" onClick={() => { padRef.current.clear(); setHasInk(false) }}>Hapus</button>
        <button className="btn" onClick={next} disabled={!hasInk}>
          {i + 1 >= DIGITS.length ? 'Simpan ✔' : 'Lanjut →'}
        </button>
      </div>
    </div>
  )
}
