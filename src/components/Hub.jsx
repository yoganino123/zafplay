import Pic from './Pic.jsx'

export const GAMES = [
  { id: 'mathkilat', name: 'Math Kilat', desc: 'Tambah & kurang secepat kilat', img: 'mathkilat.png', emoji: '🧮' },
]

export default function Hub({ user, onPlay, onBack }) {
  return (
    <div className="screen center">
      <Pic name="console.png" fallback="🕹️" className="hero" alt="Game" />
      <h1>Halo, {user.name}!</h1>
      <p className="sub">Mau main game apa hari ini?</p>

      <div className="games">
        {GAMES.map((g) => (
          <button key={g.id} className="card game" onClick={() => onPlay(g.id)}>
            <Pic name={g.img} fallback={g.emoji} className="gicon" alt={g.name} />
            <b>{g.name}</b>
            <small>{g.desc}</small>
          </button>
        ))}
        <div className="card game soon">
          <span className="pic-fallback gicon">🚧</span>
          <b>Segera hadir</b>
          <small>Game baru menyusul!</small>
        </div>
      </div>

      <button className="btn ghost" onClick={onBack}>← Ganti pemain</button>
    </div>
  )
}
