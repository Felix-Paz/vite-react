export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
