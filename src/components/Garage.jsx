import { useState } from 'react'
import RobotSvg from './RobotSvg.jsx'
import { SLOTS, TIERS, MAX_TOTAL, nextPrice, totalTiers } from '../lib/robot.js'

function beep(freq = 660, ms = 120) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    const gn = ctx.createGain()
    o.frequency.value = freq
    o.type = 'square'
    gn.gain.value = 0.05
    o.connect(gn)
    gn.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + ms / 1000)
    setTimeout(() => ctx.close(), ms + 100)
  } catch (e) { /* abaikan */ }
}

export default function Garage({ user, onBuy, onRename, onBack }) {
  const [sel, setSel] = useState('head')
  const [bump, setBump] = useState(null)
  const robot = user.robot || {}
  const coins = user.coins || 0
  const slot = SLOTS.find((s) => s.id === sel)
  const tier = robot[sel] || 0
  const price = nextPrice(tier)
  const can = price !== null && coins >= price
  const total = totalTiers(robot)

  const buy = () => {
    if (!can) return beep(180, 150)
    onBuy(sel, price)
    setBump(sel)
    beep(520)
    setTimeout(() => beep(780, 160), 110)
    setTimeout(() => setBump(null), 700)
  }

  return (
    <div className="screen garage">
      <div className="g-top">
        <button className="btn ghost tiny" onClick={onBack}>← Kembali</button>
        <span className="coins">🪙 {coins}</span>
      </div>

      <input
        className="robot-name"
        value={user.robotName || ''}
        maxLength={14}
        placeholder="Beri nama robotmu"
        onChange={(e) => onRename(e.target.value)}
      />
      <div className="g-progress">
        <div style={{ width: `${(total / MAX_TOTAL) * 100}%` }} />
      </div>

      <RobotSvg robot={robot} selected={sel} onSelect={setSel} bump={bump} />

      <div className="slot-list">
        {SLOTS.map((s) => (
          <button key={s.id} className={`chip ${sel === s.id ? 'on' : ''}`} onClick={() => setSel(s.id)}>
            <span>{s.emoji}</span>
            <small>{s.name}</small>
            <i style={{ color: TIERS[robot[s.id] || 0].color }}>{'★'.repeat(robot[s.id] || 0) || '–'}</i>
          </button>
        ))}
      </div>

      <div className="buy-panel">
        <b>{slot.emoji} {slot.name}</b>
        <span style={{ color: TIERS[tier].color }}>{TIERS[tier].name}</span>
        {price === null ? (
          <span className="maxed">⭐ Sudah tingkat tertinggi!</span>
        ) : (
          <button className="btn buy" disabled={!can} onClick={buy}>
            Upgrade ke {TIERS[tier + 1].name} · 🪙 {price}
          </button>
        )}
        {price !== null && !can && <small>Kurang {price - coins} koin. Main Math Kilat untuk cari koin!</small>}
        {total === MAX_TOTAL && <span className="maxed">🏆 Robot sempurna!</span>}
      </div>
    </div>
  )
}
