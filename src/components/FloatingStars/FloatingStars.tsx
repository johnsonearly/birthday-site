import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface Props {
  /** Stars per 100k px² of screen; capped for performance. */
  density?: number
  mode?: 'twinkle' | 'rise'
  colors?: string[]
  /** Max radius in px */
  size?: number
  speed?: number
  className?: string
}

interface P { x: number; y: number; r: number; a: number; ph: number; sp: number; c: string; vy: number }

/** Single lightweight canvas for stars / particles. Pauses when tab hidden; static under reduced motion. */
export function FloatingStars({
  density = 9, mode = 'twinkle', colors = ['#ffffff', '#c9a6ff', '#f2b7ff'], size = 1.4, speed = 1, className = '',
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = 0, h = 0, raf = 0, parts: P[] = [], last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const make = (): P => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (0.3 + Math.random()) * size,
      a: 0.3 + Math.random() * 0.7,
      ph: Math.random() * Math.PI * 2,
      sp: 0.4 + Math.random() * 1.2,
      c: colors[(Math.random() * colors.length) | 0],
      vy: (0.15 + Math.random() * 0.5) * speed,
    })
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(260, Math.round((w * h) / 100000 * density))
      parts = Array.from({ length: n }, make)
      draw(0)
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.001 * p.sp + p.ph)
        ctx.globalAlpha = p.a * tw
        ctx.fillStyle = p.c
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (t - last < 33) return // ~30fps is plenty for ambient motion
      const dt = Math.min(64, t - last) / 16.7
      last = t
      if (mode === 'rise') {
        for (const p of parts) {
          p.y -= p.vy * dt
          p.x += Math.sin(t * 0.0005 * p.sp + p.ph) * 0.15 * dt
          if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w }
        }
      }
      draw(t)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduced) raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVis)
    if (!reduced) raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, mode, size, speed, reduced])

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full ${className}`} />
}
