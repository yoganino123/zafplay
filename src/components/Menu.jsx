import { LEVELS, GAME_SECONDS } from '../lib/game.js'

export default function Menu({ user, onLevel, onStart, onCalibrate, onDelete, onBack }) {
  return (
    <div className="screen center">
      <div className="avatar big">{user.avatar}</div>
      <h1>Halo, {user.name}!</h1>
      <p className="sub">Jawab soal tambah &amp; kurang sebanyak-banyaknya dalam {GAME_SECONDS} detik.</p>

      <div className="levels">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`card level ${user.level === l.id ? 'sel' : ''}`}
            onClick={() => onLevel(l.id)}
          >
            <span className="avatar">{l.emoji}</span>
            <b>{l.name}</b>
            <small>{l.desc}</small>
            <small>🏆 {user.best?.[l.id] || 0}</small>
          </button>
        ))}
      </div>

      <button className="btn big-btn" onClick={onStart}>▶ Main!</button>

      <div className="row wrap">
        <button className="btn ghost" onClick={onCalibrate}>✍️ Latih tulisanku</button>
        <button className="btn ghost" onClick={onBack}>← Pilih game</button>
        <button className="btn ghost danger" onClick={onDelete}>🗑 Hapus pemain</button>
      </div>
    </div>
  )
}
