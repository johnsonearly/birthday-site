import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface BurstHandle { fire: (x?: number, y?: number, count?: number) => void }
interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string; star: boolean }
const COLORS = ['#ffffff', '#c9a6ff', '#f2b7ff', '#8b35ff', '#ffe9a8']

/** One-shot celebratory burst. rAF only runs while particles are alive. */
export const ParticleBurst = forwardRef<BurstHandle, { reduced?: boolean }>(({ reduced }, ref) => {
  const cv = useRef<HTMLCanvasElement>(null)
  const parts = useRef<P[]>([])
  const raf = useRef(0)
  const size = useRef({ w: 0, h: 0 })

  const loop = useRef((last: number) => {
    const c = cv.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const now = performance.now()
    const dt = Math.min(2, (now - last) / 16.7)
    ctx.clearRect(0, 0, size.current.w, size.current.h)
    parts.current = parts.current.filter((p) => p.life < p.max)
    for (const p of parts.current) {
      p.vy += 0.045 * dt; p.vx *= 0.992
      p.x += p.vx * dt; p.y += p.vy * dt; p.life += dt
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max)
      ctx.fillStyle = p.c
      ctx.beginPath()
      if (p.star) {
        for (let k = 0; k < 8; k++) {
          const rr = k % 2 ? p.r * 0.4 : p.r * 1.6, a = (k * Math.PI) / 4
          ctx.lineTo(p.x + Math.cos(a) * rr, p.y + Math.sin(a) * rr)
        }
        ctx.closePath()
      } else ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }
    raf.current = parts.current.length ? requestAnimationFrame(() => loop.current(now)) : 0
    if (!parts.current.length) ctx.clearRect(0, 0, size.current.w, size.current.h)
  })

  useEffect(() => {
    const c = cv.current!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      const r = c.getBoundingClientRect()
      size.current = { w: r.width, h: r.height }
      c.width = r.width * dpr; c.height = r.height * dpr
      c.getContext('2d')!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); raf.current = 0 }
  }, [])

  useImperativeHandle(ref, () => ({
    fire: (x, y, count = 90) => {
      if (reduced) return
      const { w, h } = size.current
      const cx = x ?? w / 2, cy = y ?? h * 0.45
      const n = w < 500 ? Math.round(count * 0.6) : count
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 5.5
        parts.current.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, life: 0, max: 70 + Math.random() * 60,
          r: 1.2 + Math.random() * 2.4, c: COLORS[(Math.random() * COLORS.length) | 0], star: Math.random() < 0.35 })
      }
      if (!raf.current) raf.current = requestAnimationFrame(() => loop.current(performance.now()))
    },
  }), [reduced])

  return <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
})
ParticleBurst.displayName = 'ParticleBurst'
