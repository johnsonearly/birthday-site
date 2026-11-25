import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { content } from '../../data/birthdayContent'
import { CosmicBackground } from '../../components/CosmicBackground/CosmicBackground'
import { PhotoImage } from '../../components/PhotoImage/PhotoImage'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { DESKTOP_LAYOUT, MOBILE_LAYOUT } from './layouts'

const GalleryScene = lazy(() => import('./GalleryScene').then((m) => ({ default: m.GalleryScene })))

export function GalleryChapter() {
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState<number | null>(null)
  const all = mobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT
  // Fewer photos than slots → use the most balanced slots first.
  const order = mobile ? [0, 1, 2, 3, 4, 5, 6] : [0, 4, 2, 3, 1, 5, 6]
  const photos = content.gallery.photos.slice(0, all.length)
  const layout = useMemo(() => order.slice(0, photos.length).map((i) => all[i]), [all, photos.length]) // eslint-disable-line react-hooks/exhaustive-deps
  const count = photos.length

  const close = useCallback(() => setSelected(null), [])
  const step = useCallback((d: number) => setSelected((s) => (s === null ? s : (s + d + count) % count)), [count])

  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); close() }
      else if (e.key === 'ArrowRight') { e.stopPropagation(); step(1) }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); step(-1) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [selected, close, step])

  const open = selected !== null ? photos[selected] : null

  return (
    <section className="absolute inset-0 overflow-hidden" aria-label="Her universe — photo gallery">
      <CosmicBackground variant="deep" />
      <Suspense fallback={null}>
        <GalleryScene photos={photos} layout={layout} selected={selected} onSelect={setSelected}
          mobile={mobile} reduced={reduced} />
      </Suspense>

      {/* heading */}
      <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-6 pt-16 text-center sm:pt-20"
        animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.5 }}
        style={{ background: 'linear-gradient(180deg, rgba(9,4,20,.96) 0%, rgba(9,4,20,.9) 55%, rgba(9,4,20,.6) 80%, transparent 100%)', paddingBottom: '2.5rem' }}>
        <p className="mb-3 text-[11px] tracking-[0.5em] text-lavender uppercase">Chapter two</p>
        <h2 className="mx-auto max-w-2xl font-serif text-[clamp(1.9rem,min(5vw,7.5vh),3.6rem)] leading-[1.05] font-medium text-glow">
          {content.gallery.heading}
        </h2>
        <p className="mt-3 text-sm font-light text-white/70 sm:text-base">{content.gallery.subtitle}</p>
        <p className="mt-2 text-[11px] tracking-[0.25em] text-lavender/60 uppercase">
          {mobile ? 'Drag to explore · tap a photo' : 'Move your mouse · click a photo'}
        </p>
      </motion.div>

      {/* accessible thumbnail index (keyboard / screen reader / quick access) */}
      <motion.ul className="no-scrollbar absolute bottom-[4.5rem] left-1/2 z-10 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-full bg-void/70 p-1.5 backdrop-blur-md sm:bottom-3"
        animate={{ opacity: open ? 0 : 1 }} style={{ pointerEvents: open ? 'none' : 'auto' }}>
        {photos.map((p, i) => (
          <li key={i}>
            <button onClick={() => setSelected(i)} aria-label={`Open photo: ${p.caption}`}
              className="block h-11 w-11 overflow-hidden rounded-full border border-lavender/40 transition hover:scale-110 hover:border-white">
              <PhotoImage src={p.src} alt="" round focus={p.focus} />
            </button>
          </li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {open && selected !== null && (
          <motion.div key="overlay" className="absolute inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            role="dialog" aria-modal="true" aria-label={open.caption}>
            <div className="absolute inset-0" onClick={close} />
            <button onClick={close} aria-label="Close photo"
              className="absolute top-16 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-lavender/30 bg-night/70 backdrop-blur hover:border-white sm:top-20 sm:right-8">
              <X size={20} />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pt-24 pb-24 text-center sm:pb-28"
              style={{ background: 'linear-gradient(0deg, rgba(9,4,20,.92) 20%, transparent)' }}>
              <motion.div key={selected} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}>
                <p className="font-serif text-[clamp(1.5rem,4vw,2.4rem)] leading-tight italic text-blush">{open.caption}</p>
                {open.note && <p className="mt-2 text-sm font-light text-white/65">{open.note}</p>}
              </motion.div>
            </div>
            <div className="absolute inset-x-0 bottom-24 z-10 flex justify-between px-3 sm:bottom-1/2 sm:translate-y-1/2 sm:px-8">
              <button onClick={() => step(-1)} aria-label="Previous photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender/30 bg-night/70 backdrop-blur hover:border-white"><ChevronLeft size={20} /></button>
              <button onClick={() => step(1)} aria-label="Next photo" className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender/30 bg-night/70 backdrop-blur hover:border-white"><ChevronRight size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
