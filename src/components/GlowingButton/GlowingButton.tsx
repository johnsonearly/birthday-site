import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props extends HTMLMotionProps<'button'> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export function GlowingButton({ children, variant = 'primary', className = '', ...rest }: Props) {
  const base = 'relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-[13px] font-medium tracking-[0.22em] uppercase select-none touch-manipulation'
  const look = variant === 'primary'
    ? 'bg-violet text-white shadow-[0_0_0_1px_rgba(201,166,255,.5),0_0_40px_rgba(139,53,255,.55)]'
    : 'border border-lavender/30 bg-white/[0.03] text-lavender backdrop-blur-sm hover:border-lavender/60'
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`${base} ${look} ${className}`} {...rest}>
      {children}
    </motion.button>
  )
}
