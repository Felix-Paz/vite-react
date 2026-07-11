import { useEffect, useRef } from 'react'
import Magnetic from './Magnetic'
import { clamp, lerp, prefersReducedMotion } from '../lib/utils'
import './Works.css'

interface Work {
  id: string
  title: string
  category: string
  year: string
  art: 'bloom' | 'signal' | 'tide' | 'halo'
}

const WORKS: Work[] = [
  { id: '01', title: 'Bloom', category: 'Brand identity', year: '2026', art: 'bloom' },
  { id: '02', title: 'Signal', category: 'Digital product', year: '2025', art: 'signal' },
  { id: '03', title: 'Tide', category: 'Interactive installation', year: '2025', art: 'tide' },
  { id: '04', title: 'Halo', category: 'Art direction', year: '2024', art: 'halo' },
]

function Art({ variant }: { variant: Work['art'] }) {
  if (variant === 'tide') {
    return (
      <svg className="art-tide-svg" viewBox="0 0 400 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tide-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="tide-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path
          className="tide-wave tide-wave-1"
          fill="url(#tide-a)"
          d="M0 150 Q50 110 100 150 T200 150 T300 150 T400 150 T500 150 T600 150 V300 H0 Z"
        />
        <path
          className="tide-wave tide-wave-2"
          fill="url(#tide-b)"
          d="M0 190 Q50 155 100 190 T200 190 T300 190 T400 190 T500 190 T600 190 V300 H0 Z"
        />
      </svg>
    )
  }
  return (
    <>
      {variant === 'bloom' && (
        <>
          <div className="art-bloom-disc" />
          <div className="art-bloom-ring" />
          <div className="art-bloom-ring art-bloom-ring-2" />
        </>
      )}
      {variant === 'signal' && (
        <>
          <div className="art-signal-dots" />
          <div className="art-signal-bar" />
          <div className="art-signal-bar art-signal-bar-2" />
        </>
      )}
      {variant === 'halo' && (
        <>
          <div className="art-halo-ring" />
          <div className="art-halo-orbit">
            <span className="art-halo-orb" />
          </div>
        </>
      )}
    </>
  )
}

/**
 * A pinned section: vertical scroll drives the track horizontally through
 * four hand-drawn "case studies" and a closing call-to-action.
 */
export default function Works() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    let dist = 0
    const measure = () => {
      dist = Math.max(0, track.scrollWidth - window.innerWidth)
      section.style.height = `${window.innerHeight + dist}px`
    }
    measure()
    window.addEventListener('resize', measure)

    const reduced = prefersReducedMotion()
    let current = 0
    let raf = 0

    const loop = () => {
      const top = section.getBoundingClientRect().top
      const target = dist > 0 ? clamp(-top / dist, 0, 1) : 0
      current = reduced ? target : lerp(current, target, 0.1)
      if (Math.abs(current - target) < 0.0004) current = target

      track.style.transform = `translate3d(${(-current * dist).toFixed(1)}px, 0, 0)`
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${current.toFixed(4)})`
      }
      if (counterRef.current) {
        const panelCount = WORKS.length + 2 // intro + works + end card
        const index = clamp(Math.round(current * (panelCount - 1)), 1, WORKS.length)
        counterRef.current.textContent = String(index).padStart(2, '0')
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <section className="works" id="work" ref={sectionRef}>
      <div className="works-sticky">
        <div className="works-head container">
          <p className="eyebrow">
            <span className="eyebrow-index">02</span>
            Selected works
          </p>
          <div className="works-progress">
            <span className="works-counter">
              <span ref={counterRef}>01</span> / {String(WORKS.length).padStart(2, '0')}
            </span>
            <div className="works-bar">
              <div className="works-bar-fill" ref={barRef} />
            </div>
          </div>
        </div>

        <div className="works-track" ref={trackRef}>
          <div className="works-intro">
            <h2 className="section-title">
              Work
              <br />
              that <span className="serif">moves</span>
            </h2>
            <p className="works-intro-note">
              Four studies in light, rhythm and restraint — each one drawn
              entirely in code. Keep scrolling; the page goes sideways.
            </p>
          </div>

          {WORKS.map((work) => (
            <article className="work-panel" key={work.id} data-hover>
              <div className={`work-art work-art-${work.art}`} aria-hidden="true">
                <Art variant={work.art} />
              </div>
              <span className="work-ghost-index" aria-hidden="true">
                {work.id}
              </span>
              <div className="work-meta">
                <h3 className="work-title">{work.title}</h3>
                <p className="work-cat">
                  {work.category} · {work.year}
                </p>
              </div>
            </article>
          ))}

          <div className="works-end">
            <p className="works-end-text">
              Your project
              <em>here</em>
            </p>
            <Magnetic>
              <a className="btn btn-fill" href="#contact" data-hover>
                <span className="btn-label">Start something</span>
                <span className="btn-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
