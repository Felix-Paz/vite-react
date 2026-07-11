import { Fragment, useEffect, useRef } from 'react'
import { clamp, lerp, prefersReducedMotion } from '../lib/utils'
import './Kinetic.css'

const ROWS = [
  { text: 'Bold typography', cls: 'kinetic-fill', dir: -1, speed: 0.8 },
  { text: 'Fluid motion', cls: 'kinetic-stroke', dir: 1, speed: 0.6 },
  { text: 'Living color', cls: 'kinetic-serif', dir: -1, speed: 0.9 },
] as const

/**
 * Three oversized type rivers whose speed and skew react to scroll
 * velocity — scroll hard and the words surge, flick up and they reverse.
 */
export default function Kinetic() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const states = ROWS.map(() => ({ x: 0 }))
    let velocity = 0
    let lastY = window.scrollY
    let raf = 0

    const loop = () => {
      const y = window.scrollY
      const dy = clamp(y - lastY, -90, 90)
      lastY = y
      velocity = lerp(velocity, dy, 0.08)

      trackRefs.current.forEach((track, i) => {
        if (!track) return
        const group = track.firstElementChild as HTMLElement | null
        const width = group?.offsetWidth ?? 0
        if (width === 0) return
        const state = states[i]
        state.x += ROWS[i].dir * (ROWS[i].speed + velocity * 0.45)
        state.x = ((state.x % width) + width) % width - width
        track.style.transform = `translate3d(${state.x.toFixed(1)}px, 0, 0)`
      })

      if (wrapRef.current) {
        wrapRef.current.style.transform = `skewY(${clamp(velocity * 0.05, -2.5, 2.5).toFixed(2)}deg)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const group = (text: string, hidden: boolean) => (
    <span className="kinetic-group" aria-hidden={hidden || undefined}>
      {[0, 1, 2, 3].map((rep) => (
        <Fragment key={rep}>
          {text}
          <span className="kinetic-sep" aria-hidden="true">
            ✦
          </span>
        </Fragment>
      ))}
    </span>
  )

  return (
    <section className="kinetic" aria-label="Bold typography. Fluid motion. Living color.">
      <div className="kinetic-wrap" ref={wrapRef}>
        {ROWS.map((row, i) => (
          <div className={`kinetic-row ${row.cls}`} key={row.text}>
            <div
              className="kinetic-track"
              ref={(el) => {
                trackRefs.current[i] = el
              }}
            >
              {group(row.text, false)}
              {group(row.text, true)}
            </div>
          </div>
        ))}
      </div>
      <p className="kinetic-hint" aria-hidden="true">
        scroll faster — the type feels it
      </p>
    </section>
  )
}
