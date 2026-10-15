import { LEVELS } from '../lib/game.js'

export default function Result({ user, level, score, record, onAgain, onHome }) {
  const lv = LEVELS.find((l) => l.id === level)
  return (
    <div className="screen center">
      <div className="avatar big">{record ? '🎉' : '⏰'}</div>
      <h1>{record ? 'Rekor baru!' : 'Waktu habis!'}</h1>
      <div className="score-big">{score}</div>
      <p className="sub">jawaban benar · {lv.emoji} {lv.name}</p>
      <p className="sub">🏆 Skor terbaik {user.name}: <b>{user.best?.[level] || 0}</b></p>
      <div className="row">
        <button className="btn big-btn" onClick={onAgain}>🔁 Main lagi</button>
        <button className="btn ghost" onClick={onHome}>Menu</button>
      </div>
    </div>
  )
}
