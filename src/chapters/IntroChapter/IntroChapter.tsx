import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, SkipForward } from 'lucide-react'
import { content } from '../../data/birthdayContent'
import { CosmicBackground } from '../../components/CosmicBackground/CosmicBackground'
import { FloatingPhoto, type PhotoSlot } from '../../components/FloatingPhoto/FloatingPhoto'
import { GlowingButton } from '../../components/GlowingButton/GlowingButton'
import { useExperience } from '../../hooks/useExperience'
import { useImageAspects } from '../../hooks/useImageAspects'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const DESKTOP: PhotoSlot[] = [
  { x: -36, y: -12, rot: -8, w: 14, depth: 1 },
  { x: -20, y: -31, rot: 5, w: 10, depth: 0.2 },
  { x: -30, y: 26, rot: 6, w: 12, depth: 0.6 },
  { x: -15, y: 34, rot: -4, w: 9, depth: 0.1 },
  { x: 22, y: -28, rot: 7, w: 12, depth: 0.7 },
  { x: 36, y: 6, rot: -6, w: 14, depth: 1 },
  { x: 24, y: 31, rot: 4, w: 10, depth: 0.25 },
]
const MOBILE: PhotoSlot[] = [
  { x: -24, y: -34, rot: -8, w: 30, depth: 1 },
  { x: 24, y: -30, rot: 6, w: 24, depth: 0.3 },
  { x: -30, y: 31, rot: 5, w: 24, depth: 0.5 },
  { x: 4, y: 37, rot: -5, w: 30, depth: 1 },
  { x: 34, y: 24, rot: 8, w: 20, depth: 0.2 },
]

export function IntroChapter() {
  const { next, introSeen, markIntroSeen } = useExperience()
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  // With fewer photos than slots, use the most balanced slots first.
  const slots = (mobile ? MOBILE : DESKTOP)
  const order = mobile ? [0, 3, 2, 1, 4] : [0, 5, 2, 4, 6, 1, 3]
  const photos = content.introPhotos.slice(0, slots.length)
  const used = order.filter((i) => i < slots.length).slice(0, photos.length)
  const { ready, aspects } = useImageAspects(photos)

  const [done, setDone] = useState(introSeen)
  const [instant, setInstant] = useState(introSeen)
  const settled = useRef(0)

  const finish = useCallback(() => { setDone(true); markIntroSeen() }, [markIntroSeen])
  const onSettled = useCallback(() => {
    settled.current += 1
    if (settled.current >= photos.length) finish()
  }, [photos.length, finish])
  const skip = () => { setInstant(true); finish() }

  // Mouse parallax (desktop only), cleaned up on unmount.
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 18 }), sy = useSpring(my, { stiffness: 50, damping: 18 })
  useEffect(() => {
    if (mobile || reduced) return
    const on = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * -28)
      my.set((e.clientY / window.innerHeight - 0.5) * -28)
    }
    window.addEventListener('pointermove', on)
    return () => window.removeEventListener('pointermove', on)
  }, [mobile, reduced, mx, my])

  const words = content.heading.split(' ')

  return (
    <section className="absolute inset-0 overflow-hidden" aria-label="The grand entrance">
      <CosmicBackground variant="deep" />
      <div className="absolute inset-0" aria-hidden={!done}>
        {ready && photos.map((p, i) => (
          <FloatingPhoto key={`${i}-${mobile}-${instant}`} photo={p} slot={slots[used[i]]} index={i} aspect={aspects[i]}
            delay={0.5 + i * 0.28} instant={instant || done} unit={mobile ? 'min(1vw, 0.46vh)' : '1vw'} reduced={reduced} parallax={{ x: sx, y: sy }}
            onSettled={instant ? undefined : onSettled} />
        ))}
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 1 }}
          className="mb-4 text-[11px] tracking-[0.5em] text-lavender uppercase">✦ a birthday universe ✦</motion.p>
        <h1 className="font-serif text-[clamp(2.6rem,9vw,6.2rem)] leading-[0.95] font-medium text-glow" aria-label={content.heading}>
          {words.map((w, i) => (
            <span key={i} className="-mx-[0.2em] inline-block overflow-hidden px-[0.2em] pb-3 align-bottom">
              <motion.span className={`inline-block ${i === words.length - 1 ? 'italic text-blush' : ''}`}
                initial={{ y: '110%' }} animate={{ y: done ? '0%' : '110%' }}
                transition={{ duration: 1.1, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}>
                {w}{i < words.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-5 max-w-md text-[15px] leading-relaxed font-light text-white/75 sm:text-lg">
          {content.introSubtitle}
        </motion.p>
        <div className="mt-10 h-14">
          {done && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9 }}>
              <GlowingButton onClick={next}>
                {content.introCta} <ArrowRight size={16} />
              </GlowingButton>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!done && (
          <motion.button key="skip" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
            transition={{ delay: 1 }} onClick={skip}
            className="absolute bottom-5 left-1/2 z-30 flex min-h-11 -translate-x-1/2 items-center gap-2 px-4 text-[11px] tracking-[0.3em] text-lavender uppercase hover:opacity-100">
            Skip intro <SkipForward size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
