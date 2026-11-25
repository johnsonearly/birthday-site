import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { Crop } from '../../data/types'

function placeholder(label: string, ar: number) {
  const w = 512, h = Math.round(512 / ar)
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#4a1d8c'); grad.addColorStop(0.5, '#29104a'); grad.addColorStop(1, '#150827')
  g.fillStyle = grad; g.fillRect(0, 0, w, h)
  g.fillStyle = 'rgba(201,166,255,.85)'
  g.font = `${Math.round(w * 0.2)}px serif`
  g.textAlign = 'center'; g.textBaseline = 'middle'
  g.fillText('✦', w / 2, h / 2 - 14)
  g.font = `italic ${Math.round(w * 0.06)}px serif`
  g.fillStyle = 'rgba(201,166,255,.7)'
  g.fillText(label, w / 2, h / 2 + w * 0.12)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Returns a texture immediately (placeholder) and swaps to the real photo once it loads. Disposes on cleanup. */
export function usePhotoTexture(src: string, label: string, defaultAr: number, crop?: Crop) {
  const [state, setState] = useState<{ tex: THREE.Texture; ar: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    let current: THREE.Texture = placeholder(label, defaultAr)
    setState({ tex: current, ar: defaultAr })

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (cancelled) return
      const t = new THREE.Texture(img)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      if (crop) { // show only the cropped region (e.g. trim letterbox bars) via UVs
        t.repeat.set(crop.w, crop.h)
        t.offset.set(crop.x, 1 - crop.y - crop.h)
      }
      t.needsUpdate = true
      const old = current
      current = t
      const ar = Math.min(1.9, Math.max(0.5, (img.naturalWidth * (crop?.w ?? 1)) / (img.naturalHeight * (crop?.h ?? 1))))
      setState({ tex: t, ar })
      old.dispose()
    }
    img.src = src
    return () => {
      cancelled = true
      img.onload = null
      current.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, label, defaultAr, crop?.x, crop?.y, crop?.w, crop?.h])

  return state
}
