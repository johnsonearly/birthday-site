import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { GalleryPhoto } from '../../data/types'
import { usePhotoTexture } from './usePhotoTexture'
import type { Slot } from './layouts'

const damp = THREE.MathUtils.damp

interface SceneProps {
  photos: GalleryPhoto[]
  layout: Slot[]
  selected: number | null
  onSelect: (i: number) => void
  mobile: boolean
  reduced: boolean
}

interface Shared {
  /** pointer parallax in -1..1 (desktop) */
  pointer: { x: number; y: number }
  drag: { x: number; y: number }
}

function Frame({ photo, slot, index, selected, anySelected, onSelect, mobile, reduced }: {
  photo: GalleryPhoto; slot: Slot; index: number; selected: boolean; anySelected: boolean
  onSelect: (i: number) => void; mobile: boolean; reduced: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const frameMat = useRef<THREE.MeshBasicMaterial>(null)
  const hover = useRef(false)
  const t = usePhotoTexture(photo.src, photo.caption, slot.ar, photo.crop)
  const phase = useMemo(() => index * 1.7, [index])
  const { camera, size } = useThree()
  const ar = t?.ar ?? slot.ar
  // Keep the designed visual area for the slot whatever the photo's aspect ratio (no distortion, balanced composition)
  const h = Math.min(slot.h * 1.2, Math.sqrt((slot.h * slot.h * slot.ar) / ar))

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const time = reduced ? 0 : state.clock.elapsedTime
    let tx = slot.pos[0], ty = slot.pos[1] + Math.sin(time * 0.6 + phase) * 0.14, tz = slot.pos[2]
    let rx = slot.rot[0] + Math.sin(time * 0.4 + phase) * 0.03
    let ry = slot.rot[1] + Math.cos(time * 0.35 + phase) * 0.05
    let rz = slot.rot[2] + Math.sin(time * 0.3 + phase) * 0.015
    let sc = hover.current && !anySelected && !mobile ? 1.06 : 1
    let opacity = anySelected ? 0.12 : 1

    if (selected) {
      const cam = camera as THREE.PerspectiveCamera
      const dist = mobile ? 9 : 5.2
      const visH = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
      const visW = visH * (size.width / size.height)
      const fit = Math.min((visH * (mobile ? 0.56 : 0.62)) / h, (visW * 0.88) / (h * ar))
      tx = cam.position.x; ty = cam.position.y + (mobile ? 0.6 : 0.3); tz = cam.position.z - dist
      rx = ry = rz = 0; sc = fit; opacity = 1
    }
    const k = 5
    g.position.x = damp(g.position.x, tx, k, dt)
    g.position.y = damp(g.position.y, ty, k, dt)
    g.position.z = damp(g.position.z, tz, k, dt)
    g.rotation.x = damp(g.rotation.x, rx, k, dt)
    g.rotation.y = damp(g.rotation.y, ry, k, dt)
    g.rotation.z = damp(g.rotation.z, rz, k, dt)
    g.scale.setScalar(damp(g.scale.x, sc, k, dt))
    if (mat.current) mat.current.opacity = damp(mat.current.opacity, opacity, 4, dt)
    if (frameMat.current) frameMat.current.opacity = damp(frameMat.current.opacity, opacity * (selected ? 0.9 : 0.55), 4, dt)
  })

  useEffect(() => () => { document.body.style.cursor = '' }, [])

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.delta > 6 || anySelected) return // was a drag
    onSelect(index)
  }

  const w = h * ar
  return (
    <group ref={group} position={slot.pos}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); hover.current = true; if (!anySelected) document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { hover.current = false; document.body.style.cursor = '' }}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[w + 0.03, h + 0.03]} />
        <meshBasicMaterial ref={frameMat} color="#8b35ff" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial ref={mat} map={t?.tex ?? null} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60
      p[i * 3 + 1] = (Math.random() - 0.5) * 50 - 6
      p[i * 3 + 2] = -Math.random() * 30 - 4
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [count])
  useEffect(() => () => geo.dispose(), [geo])
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#e6d4ff" size={0.09} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
    </points>
  )
}

function Rig({ shared, selected, mobile, reduced }: { shared: Shared; selected: boolean; mobile: boolean; reduced: boolean }) {
  const { camera } = useThree()
  const baseY = mobile ? 0 : 0.3
  useFrame((_, dt) => {
    if (selected) return // hold the camera still while a photo is open
    const px = reduced || mobile ? 0 : shared.pointer.x * 0.9
    const py = reduced || mobile ? 0 : shared.pointer.y * 0.55
    camera.position.x = damp(camera.position.x, shared.drag.x + px, 3, dt)
    camera.position.y = damp(camera.position.y, baseY + shared.drag.y + py, 3, dt)
  })
  return null
}

export function GalleryScene({ photos, layout, selected, onSelect, mobile, reduced }: SceneProps) {
  const shared = useRef<Shared>({ pointer: { x: 0, y: 0 }, drag: { x: 0, y: 0 } }).current
  const el = useRef<HTMLDivElement>(null)
  // vertical drag range on mobile = extent of layout
  const range = useMemo<[number, number]>(() => {
    const ys = layout.map((l) => l.pos[1])
    return [Math.min(...ys) + 3, 1]
  }, [layout])

  useEffect(() => {
    const node = el.current!
    let down = false, lx = 0, ly = 0
    const onMove = (e: PointerEvent) => {
      if (!mobile) {
        const r = node.getBoundingClientRect()
        shared.pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2
        shared.pointer.y = -((e.clientY - r.top) / r.height - 0.5) * 2
      }
      if (!down) return
      const dx = e.clientX - lx, dy = e.clientY - ly
      lx = e.clientX; ly = e.clientY
      const unit = mobile ? 0.03 : 0.012
      if (mobile) shared.drag.y = Math.min(range[1], Math.max(range[0], shared.drag.y + dy * unit))
      else {
        shared.drag.x = Math.max(-3, Math.min(3, shared.drag.x - dx * unit))
        shared.drag.y = Math.max(-1.5, Math.min(1.5, shared.drag.y + dy * unit))
      }
    }
    const onDown = (e: PointerEvent) => { down = true; lx = e.clientX; ly = e.clientY }
    const onUp = () => { down = false }
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    // start mobile at the top of the journey
    if (mobile) shared.drag.y = 0
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [mobile, range, shared])

  return (
    <div ref={el} className="absolute inset-0 touch-none" style={{ touchAction: 'none' }}>
      <Canvas
        key={mobile ? 'm' : 'd'}
        dpr={[1, mobile ? 1.5 : 2]}
        camera={{ position: [0, mobile ? 0 : 0.3, mobile ? 20 : 9], fov: 50, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: !mobile, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Stars count={mobile ? 160 : 320} />
        <Rig shared={shared} selected={selected !== null} mobile={mobile} reduced={reduced} />
        {photos.slice(0, layout.length).map((p, i) => (
          <Frame key={p.src + i} photo={p} slot={layout[i]} index={i} selected={selected === i}
            anySelected={selected !== null} onSelect={onSelect} mobile={mobile} reduced={reduced} />
        ))}
      </Canvas>
    </div>
  )
}
