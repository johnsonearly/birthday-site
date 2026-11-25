import { motion, useTransform, type MotionValue } from 'framer-motion'
import { PhotoImage } from '../PhotoImage/PhotoImage'
import type { Photo } from '../../data/types'

export interface PhotoSlot {
  /** final centre offset from viewport centre, in vw / vh */
  x: number; y: number
  rot: number
  /** reference width in vw for a 4:5 portrait; other aspects get the same visual area */
  w: number
  /** 0 = far, 1 = near */
  depth: number
}

interface Props {
  photo: Photo
  slot: PhotoSlot
  index: number
  /** natural aspect ratio (width / height) of the photo as displayed */
  aspect: number
  delay: number
  /** start from final position (no flight) */
  instant?: boolean
  reduced?: boolean
  /** Size unit for one "vw" of width. Portrait layouts cap by height so tall-ish tablets don't get oversized photos. */
  unit?: string
  parallax: { x: MotionValue<number>; y: MotionValue<number> }
  onSettled?: () => void
}

/** Deterministic, varied flight origin per photo: different direction, depth and rotation. */
function startFor(i: number, depth: number) {
  const angle = (i * 137.5 + 20) * (Math.PI / 180)
  const dist = 85 + (i % 3) * 20
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist * 0.8,
    rot: (i % 2 ? 1 : -1) * (35 + (i % 4) * 14),
    scale: depth > 0.5 ? 2.6 : 0.35,
    blur: depth > 0.5 ? 10 : 2,
  }
}

export function FloatingPhoto({ photo, slot, index, aspect, delay, instant, reduced, unit = '1vw', parallax, onSettled }: Props) {
  const s = startFor(index, slot.depth)
  const finalScale = 0.82 + slot.depth * 0.22
  const noFly = instant || reduced
  // equal visual area for every aspect ratio: portraits stay tall, landscapes get wider (never distorted)
  const wVw = Math.min(slot.w * 1.45, slot.w * Math.sqrt(aspect / 0.8))
  const hVw = wVw / aspect
  const px = useTransform(parallax.x, (v) => v * (0.4 + slot.depth))
  const py = useTransform(parallax.y, (v) => v * (0.4 + slot.depth))

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 will-change-transform"
      style={{ width: `calc(${wVw} * ${unit})`, marginLeft: `calc(${-wVw / 2} * ${unit})`, aspectRatio: String(aspect), marginTop: `calc(${-hVw / 2} * ${unit})`, zIndex: Math.round(slot.depth * 10), x: px, y: py }}
    >
      <motion.div
        className="h-full w-full"
        initial={noFly
          ? { x: `${slot.x}vw`, y: `${slot.y}vh`, rotate: slot.rot, scale: finalScale, opacity: 0, filter: 'blur(0px)' }
          : { x: `${s.x}vw`, y: `${s.y}vh`, rotate: s.rot, scale: s.scale, opacity: 0, filter: `blur(${s.blur}px)` }}
        animate={{ x: `${slot.x}vw`, y: `${slot.y}vh`, rotate: slot.rot, scale: finalScale, opacity: 0.55 + slot.depth * 0.45, filter: 'blur(0px)' }}
        transition={noFly
          ? { duration: 0.8, delay: instant ? 0 : delay * 0.3, ease: 'easeOut' }
          : { duration: 2.4, delay, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.9, delay } }}
        onAnimationComplete={onSettled}
      >
        <motion.div
          className="h-full w-full overflow-hidden rounded-2xl border border-lavender/40 bg-deep shadow-[0_20px_60px_-10px_rgba(0,0,0,.7),0_0_40px_-8px_rgba(139,53,255,.45)]"
          animate={reduced ? undefined : { y: [0, -8 - slot.depth * 6, 0], rotate: [0, index % 2 ? 1.2 : -1.2, 0] }}
          transition={{ duration: 6 + (index % 4) * 1.3, repeat: Infinity, ease: 'easeInOut', delay: 2.5 + index * 0.2 }}
        >
          <PhotoImage src={photo.src} alt={photo.alt} label={`Photo ${index + 1}`} lazy={false} crop={photo.crop} focus={photo.focus} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
