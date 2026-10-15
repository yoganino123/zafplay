import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Kanvas gambar (jari / mouse / stylus). Dipakai untuk area jawaban dan corat-coret.
const Pad = forwardRef(function Pad(
  { color = '#1e1b4b', width = 8, erase = false, enabled = true, preserve = false, onStrokeStart, onStrokeEnd },
  ref,
) {
  const cvRef = useRef(null)
  const propsRef = useRef({})
  propsRef.current = { color, width, erase, enabled, onStrokeStart, onStrokeEnd }
  const strokes = useRef([])
  const cur = useRef(null)

  useImperativeHandle(ref, () => ({
    clear() {
      const cv = cvRef.current
      cv.getContext('2d').clearRect(0, 0, cv.width, cv.height)
      strokes.current = []
      cur.current = null
    },
    getStrokes: () => strokes.current,
  }))

  useEffect(() => {
    const cv = cvRef.current
    const ctx = cv.getContext('2d')
    let dpr = window.devicePixelRatio || 1

    const fit = () => {
      const r = cv.getBoundingClientRect()
      if (!r.width || !r.height) return
      dpr = window.devicePixelRatio || 1
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr)
      if (cv.width === w && cv.height === h) return
      let tmp = null
      if (preserve && cv.width && cv.height) {
        tmp = document.createElement('canvas')
        tmp.width = cv.width
        tmp.height = cv.height
        tmp.getContext('2d').drawImage(cv, 0, 0)
      } else strokes.current = []
      cv.width = w
      cv.height = h
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (tmp) ctx.drawImage(tmp, 0, 0, tmp.width / dpr, tmp.height / dpr)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(cv)

    const pos = (e) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const seg = (a, b) => {
      const p = propsRef.current
      ctx.save()
      ctx.globalCompositeOperation = p.erase ? 'destination-out' : 'source-over'
      ctx.strokeStyle = p.color
      ctx.lineWidth = p.erase ? p.width * 3 : p.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      ctx.restore()
    }

    const down = (e) => {
      if (!propsRef.current.enabled) return
      e.preventDefault()
      cv.setPointerCapture?.(e.pointerId)
      const p = pos(e)
      cur.current = [p]
      strokes.current.push(cur.current)
      seg(p, { x: p.x + 0.01, y: p.y + 0.01 })
      propsRef.current.onStrokeStart?.()
    }
    const move = (e) => {
      if (!cur.current) return
      e.preventDefault()
      const p = pos(e)
      const last = cur.current[cur.current.length - 1]
      cur.current.push(p)
      seg(last, p)
    }
    const up = () => {
      if (!cur.current) return
      cur.current = null
      propsRef.current.onStrokeEnd?.()
    }

    cv.addEventListener('pointerdown', down)
    cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerup', up)
    cv.addEventListener('pointercancel', up)
    return () => {
      ro.disconnect()
      cv.removeEventListener('pointerdown', down)
      cv.removeEventListener('pointermove', move)
      cv.removeEventListener('pointerup', up)
      cv.removeEventListener('pointercancel', up)
    }
  }, [preserve])

  return <canvas ref={cvRef} className="pad" />
})

export default Pad
