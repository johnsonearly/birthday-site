import { motion } from 'framer-motion'
import { FloatingStars } from '../FloatingStars/FloatingStars'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Variant = 'deep' | 'soft' | 'galaxy'

const nebula: Record<Variant, string[]> = {
  deep: [
    'radial-gradient(ellipse 60% 50% at 20% 25%, rgba(139,53,255,.20), transparent 70%)',
    'radial-gradient(ellipse 55% 45% at 85% 80%, rgba(41,16,74,.9), transparent 70%)',
  ],
  soft: [
    'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(242,183,255,.14), transparent 70%)',
    'radial-gradient(ellipse 60% 55% at 15% 90%, rgba(139,53,255,.20), transparent 70%)',
  ],
  galaxy: [
    'radial-gradient(ellipse 70% 40% at 50% 50%, rgba(139,53,255,.30), transparent 70%)',
    'radial-gradient(ellipse 40% 60% at 20% 30%, rgba(242,183,255,.14), transparent 70%)',
    'radial-gradient(ellipse 45% 55% at 80% 70%, rgba(201,166,255,.14), transparent 70%)',
  ],
}

export function CosmicBackground({ variant = 'deep', particles = false }: { variant?: Variant; particles?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#090414 0%,#150827 100%)' }}>
      {nebula[variant].map((bg, i) => (
        <motion.div key={i} className="absolute inset-[-10%]" style={{ background: bg }}
          animate={reduced ? undefined : { x: [0, i % 2 ? -30 : 30, 0], y: [0, 20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 22 + i * 6, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
      {variant === 'galaxy' && (
        <motion.div className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{ background: 'conic-gradient(from 0deg, transparent, rgba(139,53,255,.22), transparent 25%, rgba(242,183,255,.14) 50%, transparent 75%, rgba(139,53,255,.2) 92%, transparent)', maskImage: 'radial-gradient(circle, #000 0%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 60%)' }}
          animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 160, repeat: Infinity, ease: 'linear' }} />
      )}
      <FloatingStars density={variant === 'galaxy' ? 14 : 9} />
      {particles && <FloatingStars mode="rise" density={4} size={2.6} speed={0.6} colors={['#c9a6ff', '#f2b7ff']} />}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(9,4,20,.7) 100%)' }} />
    </div>
  )
}
