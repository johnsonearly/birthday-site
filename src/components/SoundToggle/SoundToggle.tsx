import { Volume2, VolumeX } from 'lucide-react'

export function SoundToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-pressed={playing} aria-label={playing ? 'Pause soundtrack' : 'Play soundtrack'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender/20 bg-night/50 text-lavender/80 backdrop-blur transition hover:text-white">
      {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  )
}
