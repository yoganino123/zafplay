import { useEffect, useState } from 'react'
import Home from './components/Home.jsx'
import Hub from './components/Hub.jsx'
import Menu from './components/Menu.jsx'
import Game from './components/Game.jsx'
import Result from './components/Result.jsx'
import Calibrate from './components/Calibrate.jsx'
import { loadDb, saveDb, removeSamples, MAX_USERS } from './lib/storage.js'
import { invalidateUser } from './lib/recognizer.js'

export default function App() {
  const [db, setDb] = useState(loadDb)
  const [screen, setScreen] = useState('home')
  const [uid, setUid] = useState(null)
  const [last, setLast] = useState({ score: 0, record: false })
  const [round, setRound] = useState(0)

  useEffect(() => saveDb(db), [db])

  const user = db.users.find((u) => u.id === uid)
  const patchUser = (id, fn) =>
    setDb((d) => ({ ...d, users: d.users.map((u) => (u.id === id ? fn(u) : u)) }))

  const addUser = (name, avatar) => {
    if (db.users.length >= MAX_USERS) return
    const id = 'u' + Date.now().toString(36)
    setDb((d) => ({ ...d, users: [...d.users, { id, name, avatar, level: 1, best: {}, played: 0 }] }))
    setUid(id)
    setScreen('hub')
  }

  const deleteUser = () => {
    if (!user || !window.confirm(`Hapus pemain ${user.name} beserta skornya?`)) return
    removeSamples(user.id)
    invalidateUser(user.id)
    setDb((d) => ({ ...d, users: d.users.filter((u) => u.id !== user.id) }))
    setUid(null)
    setScreen('home')
  }

  const finish = (score) => {
    const prevBest = user.best?.[user.level] || 0
    const record = score > prevBest
    patchUser(user.id, (u) => ({
      ...u,
      played: (u.played || 0) + 1,
      best: { ...u.best, [u.level]: Math.max(prevBest, score) },
    }))
    setLast({ score, record })
    setScreen('result')
  }

  const start = () => {
    setRound((r) => r + 1)
    setScreen('game')
  }

  if (screen !== 'home' && !user) return <Home users={db.users} onPick={(id) => { setUid(id); setScreen('hub') }} onAdd={addUser} />

  return (
    <>
      {screen === 'home' && (
        <Home users={db.users} onPick={(id) => { setUid(id); setScreen('hub') }} onAdd={addUser} />
      )}
      {screen === 'hub' && <Hub user={user} onPlay={() => setScreen('menu')} onBack={() => setScreen('home')} />}
      {screen === 'menu' && (
        <Menu
          user={user}
          onLevel={(l) => patchUser(user.id, (u) => ({ ...u, level: l }))}
          onStart={start}
          onCalibrate={() => setScreen('calibrate')}
          onDelete={deleteUser}
          onBack={() => setScreen('hub')}
        />
      )}
      {screen === 'calibrate' && <Calibrate user={user} onDone={() => setScreen('menu')} />}
      {screen === 'game' && (
        <Game key={round} user={user} level={user.level} onFinish={finish} onQuit={() => setScreen('menu')} />
      )}
      {screen === 'result' && (
        <Result
          user={user}
          level={user.level}
          score={last.score}
          record={last.record}
          onAgain={start}
          onHome={() => setScreen('menu')}
        />
      )}
    </>
  )
}
