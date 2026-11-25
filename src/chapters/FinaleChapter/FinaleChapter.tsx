import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { content } from '../../data/birthdayContent'
import { CosmicBackground } from '../../components/CosmicBackground/CosmicBackground'
import { GlowingButton } from '../../components/GlowingButton/GlowingButton'
import { useExperience } from '../../hooks/useExperience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { ParticleBurst, type BurstHandle } from './ParticleBurst'

const SHINE_LINES = ['Keep shining ✨', 'You already do ✨', 'Always ✨']

export function FinaleChapter() {
  const { restart } = useExperience()
  const reduced = useReducedMotion()
  const burst = useRef<BurstHandle>(null)
  const [shine, setShine] = useState(0)
  const { lead, paragraphs, closingLine } = content.finale

  useEffect(() => {
    if (reduced) return
    const ids = [window.setTimeout(() => burst.current?.fire(), 2600), window.setTimeout(() => burst.current?.fire(undefined, undefined, 70), 3300)]
    return () => ids.forEach(clearTimeout)
  }, [reduced])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  const onShine = (e: React.MouseEvent) => {
    burst.current?.fire(e.clientX, e.clientY, 80)
    setShine((s) => s + 1)
  }

  const closing = closingLine.split(' ')
  return (
    <section className="absolute inset-0 overflow-hidden" aria-label="The final surprise">
      <CosmicBackground variant="galaxy" particles />
      <ParticleBurst ref={burst} reduced={reduced} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-24 text-center no-scrollbar">
        <motion.p {...fadeUp(0.2)} className="font-serif text-[clamp(1.2rem,3.4vw,1.8rem)] italic text-lavender">{lead}</motion.p>
        <div className="mt-6 max-w-xl space-y-4">
          {paragraphs.map((p, i) => (
            <motion.p key={i} {...fadeUp(0.9 + i * 0.8)}
              className={i === 0 ? 'font-serif text-[clamp(1.5rem,4.4vw,2.6rem)] leading-snug' : 'text-[15px] leading-relaxed font-light text-white/75 sm:text-lg'}>{p}</motion.p>
          ))}
        </div>
        <h2 className="mt-8 font-serif text-[clamp(2.2rem,8vw,5rem)] leading-[1] font-medium text-glow" aria-label={closingLine}>
          {closing.map((w, i) => (
            <span key={i} className="-mx-[0.2em] inline-block overflow-hidden px-[0.2em] pb-3 align-bottom">
              <motion.span className={`inline-block ${i === closing.length - 1 ? 'italic text-blush' : ''}`}
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: reduced ? 0 : 2.4 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}>
                {w}{i < closing.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h2>
        <motion.div {...fadeUp(3.4)} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <GlowingButton variant="ghost" onClick={restart}><RotateCcw size={14} /> Experience it again</GlowingButton>
          <GlowingButton onClick={onShine}>
            <motion.span key={shine} initial={{ scale: 1.25, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}>{SHINE_LINES[shine % SHINE_LINES.length]}</motion.span>
          </GlowingButton>
        </motion.div>
      </div>
    </section>
  )
}
