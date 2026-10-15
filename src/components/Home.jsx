import { useState } from 'react';
import Pic from './Pic.jsx';
import { AVATARS } from '../lib/game.js';
import { MAX_USERS } from '../lib/storage.js';

export default function Home({ users, onPick, onAdd }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    onAdd(n.slice(0, 12), avatar);
    setAdding(false);
    setName('');
  };

  const slots = Array.from({ length: MAX_USERS }, (_, i) => users[i] || null);

  return (
    <div className="screen center">
      <Pic name="zafran.png" fallback="🦖" className="hero" alt="Zafran" />
      <h1 className="logo">Zafplay</h1>
      <p className="sub">Yok Main ?</p>

      <div className="slots">
        {slots.map((u, i) =>
          u ? (
            <button key={u.id} className="card user" onClick={() => onPick(u.id)}>
              <span className="avatar">{u.avatar}</span>
              <b>{u.name}</b>
              <small>🏆 Skor terbaik: {Math.max(0, ...Object.values(u.best || {}))}</small>
            </button>
          ) : (
            <button key={i} className="card empty" onClick={() => setAdding(true)}>
              <span className="avatar">➕</span>
              <b>Pemain baru</b>
            </button>
          ),
        )}
      </div>

      {adding && (
        <div className="overlay" onClick={() => setAdding(false)}>
          <form className="modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
            <h2>Pemain baru</h2>
            <input
              autoFocus
              value={name}
              maxLength={12}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
            />
            <div className="avatars">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a}
                  className={a === avatar ? 'sel' : ''}
                  onClick={() => setAvatar(a)}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="row">
              <button type="button" className="btn ghost" onClick={() => setAdding(false)}>
                Batal
              </button>
              <button type="submit" className="btn" disabled={!name.trim()}>
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
