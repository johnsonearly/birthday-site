import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { content } from '../../data/birthdayContent'
import { CosmicBackground } from '../../components/CosmicBackground/CosmicBackground'
import { GlowingButton } from '../../components/GlowingButton/GlowingButton'
import { useExperience } from '../../hooks/useExperience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Flower } from './Flower'

function Envelope({ onOpen, opening }: { onOpen: () => void; opening: boolean }) {
  return (
    <motion.button onClick={onOpen} disabled={opening} aria-label="Open the letter"
      className="group relative block h-[190px] w-[min(82vw,320px)] touch-manipulation sm:h-[220px] sm:w-[370px]"
      style={{ perspective: 900 }}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={opening ? { opacity: 0, y: 70, scale: 0.9 } : { opacity: 1, y: 0, scale: 1 }}
      transition={opening ? { duration: 0.9, delay: 1.2, ease: 'easeIn' } : { duration: 1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={opening ? undefined : { y: -4 }}>
      <div className="absolute inset-0 rounded-md bg-[#d9bdf7] shadow-[0_30px_80px_-20px_rgba(0,0,0,.8),0_0_60px_-10px_rgba(139,53,255,.5)]" />
      {/* letter sliding out */}
      <motion.div className="absolute inset-x-4 top-3 bottom-3 rounded-sm bg-[#fbf4ff]"
        animate={opening ? { y: -80 } : { y: 0 }} transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}>
        <div className="mx-6 mt-6 space-y-2">{[60, 80, 45].map((w) => <div key={w} className="h-1 rounded bg-deep/10" style={{ width: `${w}%` }} />)}</div>
      </motion.div>
      {/* front pocket */}
      <div className="absolute inset-0 rounded-md" style={{ clipPath: 'polygon(0 0, 0 100%, 52% 57%)', background: '#c49bee' }} />
      <div className="absolute inset-0 rounded-md" style={{ clipPath: 'polygon(100% 0, 100% 100%, 48% 57%)', background: '#c9a1f1' }} />
      <div className="absolute inset-0 rounded-md" style={{ clipPath: 'polygon(0 100%, 50% 54%, 100% 100%)', background: 'linear-gradient(180deg,#d9b9f7,#bb90e8)' }} />
      {/* flap */}
      <motion.div className="absolute inset-x-0 top-0 h-[58%] origin-top"
        style={{ transformStyle: 'preserve-3d', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: 'linear-gradient(180deg,#ecd9fe,#cfa8f3)', zIndex: opening ? 0 : 3 }}
        animate={opening ? { rotateX: 180 } : { rotateX: 0 }} transition={{ duration: 0.7, ease: 'easeInOut' }} />
      {/* seal */}
      <motion.div className="absolute top-[46%] left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-violet text-lg shadow-[0_0_24px_rgba(139,53,255,.8)]"
        animate={opening ? { opacity: 0, scale: 0.4 } : { scale: [1, 1.08, 1] }}
        transition={opening ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity }}>♥</motion.div>
    </motion.button>
  )
}

export function LetterChapter() {
  const { next } = useExperience()
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed')
  const { heading, paragraphs, signoff, closing } = content.letter

  const open = () => {
    if (phase !== 'closed') return
    if (reduced) { setPhase('open'); return }
    setPhase('opening')
    window.setTimeout(() => setPhase('open'), 2100)
  }

  // progressive word reveal
  let wordIdx = 0
  const speed = reduced ? 0 : 0.045
  const renderWords = (text: string) =>
    text.split(' ').map((w, i) => {
      const d = 1.0 + wordIdx++ * speed
      return (
        <motion.span key={i} className="inline-block" initial={{ opacity: reduced ? 1 : 0, filter: reduced ? 'none' : 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.6, delay: d }}>
          {w}&nbsp;
        </motion.span>
      )
    })
  const total = paragraphs.join(' ').split(' ').length
  const endDelay = 1.0 + (total + 6) * speed

  return (
    <section className="absolute inset-0 overflow-hidden" aria-label="A letter from me">
      <CosmicBackground variant="soft" particles />
      <div className="relative z-10 flex h-full flex-col items-center px-4 pt-16 pb-20 sm:pt-20">
        <motion.div className="mb-3 text-center sm:mb-6" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="mb-2 text-[11px] tracking-[0.5em] text-lavender uppercase">Chapter three</p>
          <h2 className="font-serif text-[clamp(1.45rem,4.6vw,3rem)] leading-tight font-medium text-glow">{heading}</h2>
        </motion.div>

        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase !== 'open' ? (
              <motion.div key="env" className="flex flex-col items-center gap-6" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <Envelope onOpen={open} opening={phase === 'opening'} />
                <motion.p animate={{ opacity: phase === 'closed' ? [0.4, 1, 0.4] : 0 }} transition={{ duration: 2.4, repeat: Infinity }}
                  className="text-[11px] tracking-[0.35em] text-lavender uppercase">Tap to open</motion.p>
              </motion.div>
            ) : (
              <motion.article key="letter" className="relative flex max-h-full w-full max-w-xl min-h-0 flex-col"
                initial={{ opacity: 0, y: 60, rotateX: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} style={{ perspective: 1000 }}>
                <Flower className="pointer-events-none absolute -bottom-6 -left-2 z-10 h-24 w-20 drop-shadow-[0_6px_16px_rgba(139,53,255,.5)] sm:-left-10 sm:h-32 sm:w-28" sway={!reduced} />
                <div className="no-scrollbar relative overflow-y-auto rounded-sm px-6 py-6 text-[#2a1646] sm:px-12 sm:py-7"
                  style={{
                    background: 'linear-gradient(180deg,#fdf8ff,#f4e9fd)',
                    boxShadow: '0 40px 90px -20px rgba(0,0,0,.75), 0 0 80px -10px rgba(139,53,255,.45), inset 0 0 60px rgba(201,166,255,.25)',
                  }}>
                  <div className="space-y-3 font-serif text-[1.05rem] leading-[1.45] sm:space-y-2.5 sm:text-[clamp(1rem,2.2vh,1.3rem)]">
                    {paragraphs.map((p, i) => (
                      <p key={i} className={i === 0 ? 'text-[1.25rem] font-semibold italic sm:text-[clamp(1.2rem,2.9vh,1.6rem)]' : ''}>{renderWords(p)}</p>
                    ))}
                  </div>
                  <motion.div className="mt-5 text-right" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: endDelay, duration: 1 }}>
                    <p className="font-serif text-lg italic">{signoff}</p>
                    <p className="font-hand text-4xl text-[#6d2fd0] sm:text-5xl">{closing}</p>
                  </motion.div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 h-14">
          {phase === 'open' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : Math.min(endDelay, 6), duration: 0.8 }}>
              <GlowingButton onClick={next}>Next <ArrowRight size={16} /></GlowingButton>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
