import { motion } from 'framer-motion'

export function Flower({ className = '', sway = true }: { className?: string; sway?: boolean }) {
  return (
    <motion.svg viewBox="0 0 120 160" className={className} aria-hidden
      style={{ originX: '50%', originY: '100%' }}
      animate={sway ? { rotate: [-2.5, 2.5, -2.5] } : undefined}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M60 158 C58 120 62 100 60 74" stroke="#7a4fb5" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M60 124 C44 118 34 104 30 96 C46 98 58 108 60 124Z" fill="#9b72d6" opacity=".85" />
      <path d="M60 138 C76 132 86 120 92 110 C74 112 62 122 60 138Z" fill="#b794ea" opacity=".85" />
      <g transform="translate(60 52)">
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-21" rx="11" ry="22" fill={i % 2 ? '#f2b7ff' : '#d79bff'}
            transform={`rotate(${i * 60})`} opacity=".95" />
        ))}
        <circle r="9" fill="#fff3c9" />
        <circle r="4" fill="#f0c36b" />
      </g>
    </motion.svg>
  )
}
