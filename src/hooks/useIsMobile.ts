import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}
/** Phones, and any portrait screen (e.g. tablets held upright) get the vertical, touch-first layouts. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px), (max-aspect-ratio: 1/1)')
