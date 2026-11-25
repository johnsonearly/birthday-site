import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Crop } from '../../data/types'

interface Props {
  src: string
  alt: string
  className?: string
  label?: string
  lazy?: boolean
  round?: boolean
  /** object-position for cover crops (small/round thumbnails) */
  focus?: string
  /** crop rectangle (fractions). The parent frame should already match the cropped aspect ratio. */
  crop?: Crop
}

/**
 * Image with a graceful placeholder if the asset is missing (or no src is given).
 * Frames sized to the photo's own aspect ratio never distort or crop it.
 */
export function PhotoImage({ src, alt, className = '', label, lazy = true, round, focus, crop }: Props) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div role="img" aria-label={alt}
        className={`flex h-full w-full flex-col items-center justify-center gap-2 text-lavender/80 ${className}`}
        style={{ background: 'linear-gradient(145deg,#3a1670 0%,#29104a 45%,#150827 100%)' }}>
        <Sparkles size={round ? 16 : 26} strokeWidth={1.25} />
        {!round && label && <span className="px-3 text-center font-serif text-sm italic opacity-80">{label}</span>}
      </div>
    )
  }
  if (crop) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img src={src} alt={alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" draggable={false} onError={() => setFailed(true)}
          className={`absolute max-w-none ${className}`}
          style={{ width: `${100 / crop.w}%`, height: `${100 / crop.h}%`, left: `${(-crop.x / crop.w) * 100}%`, top: `${(-crop.y / crop.h) * 100}%` }} />
      </div>
    )
  }
  return (
    <img src={src} alt={alt} loading={lazy ? 'lazy' : 'eager'} decoding="async" draggable={false}
      onError={() => setFailed(true)} className={`h-full w-full object-cover ${className}`}
      style={focus ? { objectPosition: focus } : undefined} />
  )
}
