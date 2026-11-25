import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useExperience } from '../../hooks/useExperience'

/** Discreet prev/next arrows. Hidden on intro (it has its own CTA) and on last chapter for next. */
export function ChapterNavigation({ hideNext }: { hideNext?: boolean }) {
  const { index, total, next, prev } = useExperience()
  const btn = 'pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-lavender/20 bg-night/50 text-lavender/80 backdrop-blur transition hover:text-white hover:border-lavender/50 disabled:opacity-0 disabled:pointer-events-none'
  return (
    <div className="pointer-events-none flex w-full items-center justify-between">
      <button className={btn} onClick={prev} disabled={index === 0} aria-label="Previous chapter"><ChevronLeft size={18} /></button>
      <button className={btn} onClick={next} disabled={index === total - 1 || hideNext} aria-label="Next chapter"><ChevronRight size={18} /></button>
    </div>
  )
}
