import { useEffect, useRef, useState } from 'react'
import Pad from './Pad.jsx'
import { GAME_SECONDS, genQuestion } from '../lib/game.js'
import { groupStrokes, recognizeStrokes, invalidateUser } from '../lib/recognizer.js'
import { addSamples } from '../lib/storage.js'

const COLORS = ['#e63946', '#2a9d8f', '#3a86ff', '#f4a261', '#1e1b4b']

export default function Game({ user, level, onFinish, onQuit }) {
  const answerRef = useRef(null)
  const scratchRef = useRef(null)
  const [count, setCount] = useState(3)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [q, setQ] = useState(() => genQuestion(level))
  const [preview, setPreview] = useState('')
  const [fb, setFb] = useState(null)
  const [hasInk, setHasInk] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [erase, setErase] = useState(false)

  // state mutable untuk callback (hindari closure basi)
  const st = useRef({ q, score: 0, running: false, busy: false, idle: null, timeouts: [] })
  st.current.q = q

  const later = (fn, ms) => {
    const t = setTimeout(fn, ms)
    st.current.timeouts.push(t)
  }

  // hitung mundur 3-2-1
  useEffect(() => {
    if (count <= 0) {
      st.current.running = true
      setRunning(true)
      return
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800)
    return () => clearTimeout(t)
  }, [count])

  // timer 60 detik
  useEffect(() => {
    if (!running) return
    const end = Date.now() + GAME_SECONDS * 1000
    const iv = setInterval(() => {
      const left = Math.max(0, (end - Date.now()) / 1000)
      setTimeLeft(left)
      if (left <= 0) {
        clearInterval(iv)
        st.current.running = false
        setRunning(false)
        onFinish(st.current.score)
      }
    }, 100)
    return () => clearInterval(iv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(
    () => () => {
      clearTimeout(st.current.idle)
      st.current.timeouts.forEach(clearTimeout)
    },
    [],
  )

  const evaluate = (force) => {
    const s = st.current
    if (!s.running || s.busy || !answerRef.current) return
    const strokes = answerRef.current.getStrokes()
    if (!strokes.length) return
    const expected = String(s.q.ans)
    const groups = groupStrokes(strokes, expected.length)
    const digits = groups.map((g) => recognizeStrokes(g.strokes, user.id))
    const guess = digits.join('')
    setPreview(guess)
    if (groups.length < expected.length && !force) return // tunggu angka berikutnya

    s.busy = true
    if (guess === expected) {
      s.score += 1
      setScore(s.score)
      setFb('ok')
      if (groups.length === expected.length) {
        addSamples(user.id, groups.map((g, i) => ({ digit: expected[i], strokes: g.strokes })))
        invalidateUser(user.id)
      }
      later(() => {
        answerRef.current?.clear()
        setHasInk(false)
        setPreview('')
        setFb(null)
        setQ((prev) => genQuestion(level, prev))
        s.busy = false
      }, 550)
    } else {
      setFb('no')
      later(() => {
        answerRef.current?.clear()
        setHasInk(false)
        setPreview('')
        setFb(null)
        s.busy = false
      }, 800)
    }
  }

  const onStrokeStart = () => {
    clearTimeout(st.current.idle)
    setHasInk(true)
  }
  const onStrokeEnd = () => {
    clearTimeout(st.current.idle)
    st.current.idle = setTimeout(() => evaluate(false), 900)
  }
  const clearAnswer = () => {
    clearTimeout(st.current.idle)
    answerRef.current?.clear()
    setHasInk(false)
    setPreview('')
  }

  const pct = (timeLeft / GAME_SECONDS) * 100

  return (
    <div className="game">
      <header className="hud">
        <button className="btn tiny ghost" onClick={onQuit}>✕</button>
        <span className="who">{user.avatar} {user.name}</span>
        <span className="score">⭐ {score}</span>
        <span className={`time ${timeLeft <= 10 ? 'low' : ''}`}>⏱ {Math.ceil(timeLeft)}</span>
      </header>
      <div className="bar"><div className={timeLeft <= 10 ? 'low' : ''} style={{ width: `${pct}%` }} /></div>

      <div className="question">
        {q.a} {q.op === '+' ? '+' : '−'} {q.b} = <span className="qm">?</span>
      </div>

      <div className="boards">
        <section className="panel answer">
          <div className="panel-head">
            <b>✍️ Tulis jawabanmu</b>
            <span className="guess">{preview && `Terbaca: ${preview}`}</span>
            <button className="btn tiny ghost" onClick={clearAnswer}>Hapus</button>
            <button className="btn tiny" onClick={() => evaluate(true)} disabled={!hasInk}>Cek ✔</button>
          </div>
          <div className={`canvas-wrap ${fb || ''}`}>
            {!hasInk && <div className="hint">Tulis angka di sini dengan jarimu</div>}
            <Pad
              ref={answerRef}
              width={10}
              color="#312e81"
              enabled={running && !fb}
              onStrokeStart={onStrokeStart}
              onStrokeEnd={onStrokeEnd}
            />
            {fb && <div className="fb">{fb === 'ok' ? '✅' : '❌'}</div>}
          </div>
        </section>

        <section className="panel scratch">
          <div className="panel-head">
            <b>🖍 Corat-coret</b>
            <div className="tools">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`dot ${!erase && color === c ? 'sel' : ''}`}
                  style={{ background: c }}
                  onClick={() => { setColor(c); setErase(false) }}
                  aria-label={`warna ${c}`}
                />
              ))}
              <button className={`btn tiny ghost ${erase ? 'on' : ''}`} onClick={() => setErase((e) => !e)}>🧽</button>
              <button className="btn tiny ghost" onClick={() => scratchRef.current?.clear()}>🗑</button>
            </div>
          </div>
          <div className="canvas-wrap">
            <Pad ref={scratchRef} width={5} color={color} erase={erase} preserve />
          </div>
        </section>
      </div>

      {!running && count > 0 && (
        <div className="overlay countdown"><span key={count}>{count}</span></div>
      )}
    </div>
  )
}
