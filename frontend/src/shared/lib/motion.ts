import type { Transition } from 'framer-motion'

/**
 * Spring presets expressed the way Apple tunes them: damping ratio → `bounce`
 * (bounce ≈ 1 − damping) and response → `visualDuration` (seconds).
 *
 * Use `default` for anything that simply appears or moves. Reserve `momentum`
 * for motion that continues a gesture the user released with velocity.
 */
export const spring = {
  default: { type: 'spring', bounce: 0, visualDuration: 0.4 },
  snappy: { type: 'spring', bounce: 0, visualDuration: 0.28 },
  momentum: { type: 'spring', bounce: 0.2, visualDuration: 0.3 },
} satisfies Record<string, Transition>

/** Distance a flick travels under scroll-style exponential deceleration. */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

/** Progressive resistance past a boundary: the further out, the less it follows. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}

type Sample = { x: number; t: number }

/** Release velocity (px/s) from the last ~100ms of pointer samples. */
export function releaseVelocity(samples: Sample[]) {
  if (samples.length < 2) return 0
  const last = samples[samples.length - 1]
  let first = samples[0]
  for (let i = samples.length - 1; i >= 0; i--) {
    if (last.t - samples[i].t > 100) break
    first = samples[i]
  }
  const dt = last.t - first.t
  return dt > 0 ? ((last.x - first.x) / dt) * 1000 : 0
}
