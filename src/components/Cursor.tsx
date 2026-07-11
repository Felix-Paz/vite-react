import { useEffect, useRef } from 'react'
import { isFinePointer, lerp, prefersReducedMotion } from '../lib/utils'
import './Cursor.css'

/**
 * Custom cursor: a crisp dot, a lagging ring, and a large soft glow that
 * lights whatever the pointer passes over. Only mounts for fine pointers.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return
    document.documentElement.classList.add('has-cursor')

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let rx = tx
    let ry = ty
    let gx = tx
    let gy = ty
    let raf = 0
    let seen = false

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!seen) {
        seen = true
        rx = gx = tx
        ry = gy = ty
        dotRef.current?.classList.add('is-visible')
        ringRef.current?.classList.add('is-visible')
        glowRef.current?.classList.add('is-visible')
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null
      const interactive = !!target?.closest(
        'a, button, input, label, [data-hover]',
      )
      ringRef.current?.classList.toggle('is-active', interactive)
      dotRef.current?.classList.toggle('is-active', interactive)
    }

    const onDown = () => ringRef.current?.classList.add('is-down')
    const onUp = () => ringRef.current?.classList.remove('is-down')

    const loop = () => {
      rx = lerp(rx, tx, 0.2)
      ry = lerp(ry, ty, 0.2)
      gx = lerp(gx, tx, 0.07)
      gy = lerp(gy, ty, 0.07)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-glow" ref={glowRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
    </div>
  )
}
