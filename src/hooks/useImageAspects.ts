import { useEffect, useState } from 'react'
import type { Photo } from '../data/types'

export const FALLBACK_ASPECT = 0.8

/**
 * Measures each photo's natural (cropped) aspect ratio so frames can match it exactly — no stretching,
 * no layout shift. Resolves once every image has loaded or failed (failed → fallback aspect).
 * The images land in the HTTP cache, so the <img> tags that follow don't re-download.
 */
export function useImageAspects(photos: Photo[]) {
  const [state, setState] = useState<{ ready: boolean; aspects: number[] }>({ ready: false, aspects: [] })
  const key = photos.map((p) => p.src + JSON.stringify(p.crop ?? '')).join('|')

  useEffect(() => {
    let cancelled = false
    setState({ ready: false, aspects: [] })
    const res: number[] = photos.map(() => FALLBACK_ASPECT)
    let left = photos.length
    const done = () => { if (--left <= 0 && !cancelled) setState({ ready: true, aspects: res }) }
    if (!photos.length) { setState({ ready: true, aspects: [] }); return }
    const imgs = photos.map((p, i) => {
      const img = new Image()
      img.onload = () => {
        const c = p.crop
        res[i] = Math.min(1.9, Math.max(0.5, (img.naturalWidth * (c?.w ?? 1)) / (img.naturalHeight * (c?.h ?? 1))))
        done()
      }
      img.onerror = done
      img.src = p.src
      return img
    })
    // never block the experience on a slow network
    const t = window.setTimeout(() => { if (!cancelled) setState({ ready: true, aspects: res }) }, 4000)
    return () => { cancelled = true; clearTimeout(t); imgs.forEach((im) => { im.onload = null; im.onerror = null }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
