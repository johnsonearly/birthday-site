import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { CHAPTERS } from '../data/chapters'

interface Ctx {
  index: number
  direction: 1 | -1
  total: number
  next: () => void
  prev: () => void
  goTo: (i: number) => void
  restart: () => void
  /** Intro photo animation only plays once per session unless replayed. */
  introSeen: boolean
  markIntroSeen: () => void
}
const ExperienceContext = createContext<Ctx | null>(null)
const KEY = 'her-universe-intro-seen'

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [introSeen, setIntroSeen] = useState(() => {
    try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
  })
  const total = CHAPTERS.length

  const goTo = useCallback((i: number) => {
    setIndex((cur) => {
      const n = Math.max(0, Math.min(total - 1, i))
      setDirection(n >= cur ? 1 : -1)
      return n
    })
  }, [total])
  const next = useCallback(() => setIndex((c) => { const n = Math.min(total - 1, c + 1); setDirection(1); return n }), [total])
  const prev = useCallback(() => setIndex((c) => { const n = Math.max(0, c - 1); setDirection(-1); return n }), [])
  const markIntroSeen = useCallback(() => {
    setIntroSeen(true)
    try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
  }, [])
  const restart = useCallback(() => {
    try { sessionStorage.removeItem(KEY) } catch { /* ignore */ }
    setIntroSeen(false)
    setDirection(-1)
    setIndex(0)
  }, [])

  const value = useMemo(() => ({ index, direction, total, next, prev, goTo, restart, introSeen, markIntroSeen }),
    [index, direction, total, next, prev, goTo, restart, introSeen, markIntroSeen])
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience() {
  const c = useContext(ExperienceContext)
  if (!c) throw new Error('useExperience must be used inside ExperienceProvider')
  return c
}
