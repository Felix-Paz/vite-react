import { useRef, type ReactNode, type MouseEvent } from 'react'
import { isFinePointer, prefersReducedMotion } from '../lib/utils'

interface MagneticProps {
  children: ReactNode
  /** how strongly the element chases the cursor (0–1) */
  strength?: number
  className?: string
}

/**
 * Makes its children gently follow the cursor while hovered and spring
 * back on leave. The chase is smoothed by a CSS transform transition.
 */
export default function Magnetic({ children, strength = 0.32, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer() || prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }

  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <div
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  )
}
