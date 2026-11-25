import { useCallback, useEffect, useRef, useState } from 'react'

/** Soundtrack control. Never autoplays: only starts from an explicit user toggle. */
export function useAudio(src?: string) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(false)

  // Only show the control if the file actually exists (dev servers may answer 200 with HTML).
  useEffect(() => {
    if (!src) return
    const ctl = new AbortController()
    fetch(src, { method: 'HEAD', signal: ctl.signal })
      .then((r) => setAvailable(r.ok && (r.headers.get('content-type') ?? '').startsWith('audio')))
      .catch(() => {})
    return () => ctl.abort()
  }, [src])

  useEffect(() => {
    if (!src) return
    const a = new Audio()
    a.loop = true
    a.volume = 0.5
    a.preload = 'none'
    a.src = src
    const onErr = () => { setAvailable(false); setPlaying(false) }
    a.addEventListener('error', onErr)
    ref.current = a
    return () => {
      a.pause()
      a.removeEventListener('error', onErr)
      a.removeAttribute('src')
      ref.current = null
    }
  }, [src])

  const toggle = useCallback(async () => {
    const a = ref.current
    if (!a) return
    if (a.paused) {
      try { await a.play(); setPlaying(true) } catch { setPlaying(false) }
    } else {
      a.pause(); setPlaying(false)
    }
  }, [])

  return { playing, toggle, available }
}
