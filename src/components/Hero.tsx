import { useEffect, useRef } from 'react'
import Magnetic from './Magnetic'
import Marquee from './Marquee'
import SplitText from './SplitText'
import { isFinePointer, lerp, prefersReducedMotion } from '../lib/utils'
import './Hero.css'

const KINETIC_WORD = 'MOTION'

interface HeroProps {
  ready: boolean
}

/**
 * Full-viewport opener: staggered type reveal, a variable-weight kinetic
 * word, and a mesh-gradient background that drifts toward the pointer.
 */
export default function Hero({ ready }: HeroProps) {
  const blobARef = useRef<HTMLDivElement>(null)
  const blobBRef = useRef<HTMLDivElement>(null)
  const blobCRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    }

    const loop = () => {
      x = lerp(x, tx, 0.045)
      y = lerp(y, ty, 0.045)
      if (blobARef.current) {
        blobARef.current.style.transform = `translate3d(${x * 90}px, ${y * 70}px, 0)`
      }
      if (blobBRef.current) {
        blobBRef.current.style.transform = `translate3d(${x * -130}px, ${y * -90}px, 0)`
      }
      if (blobCRef.current) {
        blobCRef.current.style.transform = `translate3d(${x * 60}px, ${y * 110}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-blob hero-blob-a" ref={blobARef} />
        <div className="hero-blob hero-blob-b" ref={blobBRef} />
        <div className="hero-blob hero-blob-c" ref={blobCRef} />
        <div className="hero-grid-lines" />
      </div>

      <div className="hero-inner container">
        <p className="hero-eyebrow hero-fade" style={{ transitionDelay: '150ms' }}>
          <span>A living design showcase</span>
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          <span>Est. 2026</span>
        </p>

        <h1 className="hero-title">
          <span className="hero-line">
            <SplitText text="DESIGN" active={ready} delay={250} step={40} />
          </span>
          <span className="hero-line hero-line-serif">
            <SplitText text="in fluid" active={ready} delay={550} step={40} />
          </span>
          <span className="hero-line hero-line-kinetic" aria-label={KINETIC_WORD}>
            <span className="hero-kinetic-mask">
              {KINETIC_WORD.split('').map((char, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="hero-kinetic-char"
                  style={{
                    transitionDelay: `${820 + i * 45}ms`,
                    animationDelay: `${i * 140}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <div className="hero-row">
          <p className="hero-sub hero-fade" style={{ transitionDelay: '1150ms' }}>
            A single-page love letter to typography, color and interaction —
            every pixel placed with intent, every motion with purpose. No
            templates, no stock, no shortcuts.
          </p>

          <div className="hero-cta hero-fade" style={{ transitionDelay: '1300ms' }}>
            <Magnetic>
              <a className="btn btn-fill" href="#craft" data-hover>
                <span className="btn-label">Explore the craft</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href="#work" data-hover>
                <span className="btn-label">See the work</span>
                <span className="btn-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-badge hero-fade" style={{ transitionDelay: '1450ms' }} aria-hidden="true">
        <svg viewBox="0 0 100 100" className="hero-badge-ring">
          <defs>
            <path
              id="hero-badge-circle"
              d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
            />
          </defs>
          <text>
            <textPath href="#hero-badge-circle">
              scroll to explore · design in motion ·&#160;
            </textPath>
          </text>
        </svg>
        <span className="hero-badge-arrow">↓</span>
      </div>

      <div className="hero-marquee hero-fade" style={{ transitionDelay: '1500ms' }}>
        <Marquee
          items={['Typography', 'Color', 'Motion', 'Interaction', 'Detail', 'Craft']}
        />
      </div>
    </section>
  )
}
