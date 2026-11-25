export interface Slot {
  pos: [number, number, number]
  /** world height */
  h: number
  rot: [number, number, number]
  /** fallback aspect for placeholders */
  ar: number
}

export const DESKTOP_LAYOUT: Slot[] = [
  { pos: [-4.7, -0.4, 0.6], h: 2.4, rot: [0, 0.28, -0.05], ar: 0.8 },
  { pos: [-2.6, -2.1, -1.6], h: 1.8, rot: [0, 0.15, 0.04], ar: 1.4 },
  { pos: [0.1, -0.2, 1.3], h: 2.3, rot: [0.02, -0.12, 0.03], ar: 0.8 },
  { pos: [3.2, -1.5, -0.6], h: 2.0, rot: [0, -0.25, -0.04], ar: 1.3 },
  { pos: [5.6, 0.3, -2.2], h: 2.2, rot: [0, -0.3, 0.06], ar: 0.75 },
  { pos: [-3.4, 0.9, -3.2], h: 1.6, rot: [0, 0.2, 0.07], ar: 1.2 },
  { pos: [2.0, -2.9, 2.0], h: 1.3, rot: [0, 0.1, -0.06], ar: 0.9 },
]

/** Portrait viewport: vertical journey — drag up/down to explore. */
export const MOBILE_LAYOUT: Slot[] = [
  { pos: [-2.0, 1.2, 1.0], h: 4.0, rot: [0, 0.22, -0.04], ar: 0.8 },
  { pos: [2.4, -1.9, -2.0], h: 3.0, rot: [0, -0.2, 0.05], ar: 1.2 },
  { pos: [-2.0, -5.0, 0.5], h: 3.8, rot: [0, 0.2, 0.03], ar: 0.8 },
  { pos: [2.3, -8.2, -1.5], h: 3.0, rot: [0, -0.22, -0.05], ar: 1.0 },
  { pos: [-2.2, -11.4, 1.2], h: 3.8, rot: [0, 0.18, 0.04], ar: 0.8 },
  { pos: [2.2, -14.4, -2.2], h: 2.8, rot: [0, -0.2, 0.05], ar: 1.3 },
  { pos: [-0.8, -17.4, 0.5], h: 3.6, rot: [0, 0.1, -0.03], ar: 0.85 },
]
