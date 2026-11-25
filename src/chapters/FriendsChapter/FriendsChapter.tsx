import { useCallback, useEffect, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { content } from '../../data/birthdayContent'
import { CosmicBackground } from '../../components/CosmicBackground/CosmicBackground'
import { PhotoImage } from '../../components/PhotoImage/PhotoImage'
import { GlowingButton } from '../../components/GlowingButton/GlowingButton'
import { useExperience } from '../../hooks/useExperience'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function FriendsChapter() {
  const { next: nextChapter } = useExperience()
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const { heading, subtitle, list } = content.friends
  const [active, setActive] = useState(0)
  const n = list.length
  const go = useCallback((i: number) => setActive(Math.max(0, Math.min(n - 1, i))), [n])

  // Arrow keys move the carousel; at the ends they fall through to chapter navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && active < n - 1) { e.stopPropagation(); go(active + 1) }
      else if (e.key === 'ArrowLeft' && active > 0) { e.stopPropagation(); go(active - 1) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [active, n, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(active + 1)
    else if (info.offset.x > 50 || info.velocity.x > 400) go(active - 1)
  }

  const step = mobile ? 0.62 : 0.7 // fraction of card width between cards
  const cardW = mobile ? 'min(78vw, 340px)' : '380px'

  return (
    <section className="absolute inset-0 overflow-hidden" aria-label="What your people say">
      <CosmicBackground variant="deep" />
      <div className="relative z-10 flex h-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <motion.div className="relative z-20 text-center" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <p className="mb-2 text-[11px] tracking-[0.5em] text-lavender uppercase">Chapter four</p>
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(1.8rem,4.8vw,3.2rem)] leading-tight font-medium text-glow">{heading}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-light text-white/70 sm:text-base">{subtitle}</p>
        </motion.div>

        {/* stage */}
        <div className="relative my-5 w-full min-h-0 flex-1" style={{ perspective: 1200 }} role="group" aria-roledescription="carousel" aria-label="Birthday messages">
          <motion.div className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" drag="x"
            dragConstraints={{ left: 0, right: 0 }} dragElastic={0.15} onDragEnd={onDragEnd}>
            {list.map((f, i) => {
              const off = i - active
              const abs = Math.abs(off)
              if (abs > 2) return null
              const isActive = off === 0
              return (
                <motion.article key={i}
                  aria-roledescription="slide" aria-label={`${i + 1} of ${n}`} aria-hidden={!isActive}
                  onClick={() => !isActive && go(i)}
                  className="glass absolute top-1/2 left-1/2 flex max-h-[min(100%,480px)] flex-col items-center rounded-3xl p-6 text-center sm:p-8"
                  style={{ width: cardW, marginLeft: `calc(${cardW} / -2)`, height: 'min(100%, 440px)', marginTop: 'calc(min(100%, 440px) / -2)', transformStyle: 'preserve-3d', zIndex: 10 - abs }}
                  initial={false}
                  animate={{
                    x: `${off * step * 100}%`,
                    rotateY: reduced ? 0 : off * -32,
                    scale: 1 - abs * 0.13,
                    opacity: isActive ? 1 : abs === 1 ? 0.55 : 0.25,
                    filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                    y: isActive && !reduced ? [0, -6, 0] : 0,
                  }}
                  transition={{
                    type: 'spring', stiffness: 160, damping: 22,
                    y: isActive && !reduced ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined,
                  }}>
                  <div className="pointer-events-none absolute inset-0 rounded-3xl transition-shadow duration-700"
                    style={{ boxShadow: isActive ? '0 0 0 1px rgba(201,166,255,.45), 0 0 60px -6px rgba(139,53,255,.6)' : 'none' }} />
                  <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border-2 border-lavender/60 shadow-[0_0_24px_rgba(139,53,255,.55)]">
                    <PhotoImage src={f.avatar} alt={`${f.name}`} round />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-medium">{f.name}</h3>
                  {f.relationship && (
                    <span className="mt-1 rounded-full border border-lavender/30 px-3 py-0.5 text-[10px] tracking-[0.25em] text-lavender uppercase">{f.relationship}</span>
                  )}
                  <Quote size={18} className="mt-5 shrink-0 text-violet" aria-hidden />
                  <p className="no-scrollbar mt-2 min-h-0 overflow-y-auto font-serif text-[1.15rem] leading-relaxed text-white/90 italic sm:text-[1.25rem]">{f.message}</p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>

        {/* controls */}
        <div className="flex items-center gap-4">
          <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous message"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender/30 bg-night/50 transition hover:border-white disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center" role="tablist" aria-label="Messages">
            {list.map((f, i) => (
              <button key={i} role="tab" aria-selected={i === active} aria-label={`Message from ${f.name}`} onClick={() => go(i)} className="flex h-11 items-center px-1.5">
                <span className={`block h-2 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-lavender' : 'w-2 bg-white/25'}`} />
              </button>
            ))}
          </div>
          <button onClick={() => go(active + 1)} disabled={active === n - 1} aria-label="Next message"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender/30 bg-night/50 transition hover:border-white disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="mt-3 h-12">
          <GlowingButton variant="ghost" onClick={nextChapter} className="!min-h-11 !py-2">Continue <ArrowRight size={14} /></GlowingButton>
        </div>
      </div>
    </section>
  )
}
