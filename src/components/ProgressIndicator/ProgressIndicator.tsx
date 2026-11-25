import { CHAPTERS } from '../../data/chapters'
import { useExperience } from '../../hooks/useExperience'

export function ProgressIndicator() {
  const { index, goTo } = useExperience()
  return (
    <nav aria-label="Chapters" className="flex items-center gap-1">
      {CHAPTERS.map((c, i) => (
        <button key={c.id} onClick={() => goTo(i)} aria-label={`Chapter ${i + 1}: ${c.label}`}
          aria-current={i === index ? 'step' : undefined}
          className="group flex h-11 items-center px-1">
          <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-lavender' : i < index ? 'w-4 bg-lavender/50' : 'w-4 bg-white/20 group-hover:bg-white/40'}`} />
        </button>
      ))}
    </nav>
  )
}
