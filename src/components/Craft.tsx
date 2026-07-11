import {
  useEffect,
  useState,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import SectionHead from './SectionHead'
import { useInView } from '../hooks/useInView'
import { isFinePointer, prefersReducedMotion } from '../lib/utils'
import './Craft.css'

/* ---------- card shell: 3D tilt + cursor spotlight ---------- */

interface BentoCardProps {
  className?: string
  label: string
  index: number
  children: ReactNode
}

function BentoCard({ className = '', label, index, children }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
    el.style.transform = `perspective(1100px) rotateX(${((py - 0.5) * -4.5).toFixed(2)}deg) rotateY(${((px - 0.5) * 5.5).toFixed(2)}deg)`
  }

  const onLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      className={`bento-cell reveal ${className}`}
      style={{ '--d': `${index * 90}ms` } as CSSProperties}
    >
      <div ref={ref} className="bento-card" onMouseMove={onMove} onMouseLeave={onLeave}>
        <span className="bento-label">{label}</span>
        <div className="bento-spot" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}

/* ---------- typography: live variable-weight specimen ---------- */

function TypeCard() {
  const [weight, setWeight] = useState(720)

  return (
    <div className="type-demo">
      <div
        className="type-specimen"
        style={{ fontVariationSettings: `'wght' ${weight}` }}
        aria-hidden="true"
      >
        Aa
      </div>
      <p className="type-serif-line" aria-hidden="true">
        The quick brown fox — <em>set in italics, naturally</em>
      </p>
      <div className="type-controls">
        <span className="type-readout">
          Syne · wght <strong>{weight}</strong>
        </span>
        <input
          className="type-slider"
          type="range"
          min={400}
          max={800}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          aria-label="Font weight"
          data-hover
        />
      </div>
    </div>
  )
}

/* ---------- motion: SVG blob morphing on a loop ---------- */

function MotionCard() {
  return (
    <div className="motion-demo" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="motion-blob">
        <defs>
          <linearGradient id="blob-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <path className="motion-blob-path" fill="url(#blob-gradient)" />
      </svg>
    </div>
  )
}

/* ---------- interaction: one very satisfying switch ---------- */

function ToggleCard() {
  const [on, setOn] = useState(false)

  return (
    <div className={`toggle-demo ${on ? 'is-on' : ''}`}>
      <button
        type="button"
        className="toggle-switch"
        role="switch"
        aria-checked={on}
        aria-label="Demo switch"
        onClick={() => setOn((v) => !v)}
        data-hover
      >
        <span className="toggle-knob" />
      </button>
      <p className="toggle-copy">{on ? 'Satisfying, right?' : 'Go on — flip it.'}</p>
    </div>
  )
}

/* ---------- color: palettes that repaint the canvas ---------- */

const CARD_PALETTES = [
  { name: 'Voltage', a: '#cdff57', b: '#b3a0ff' },
  { name: 'Twilight', a: '#b3a0ff', b: '#7ee8fa' },
  { name: 'Ember', a: '#ff9e7a', b: '#ffd27a' },
  { name: 'Glacier', a: '#7ee8fa', b: '#cdff57' },
]

function ColorCard() {
  const [active, setActive] = useState(0)
  const palette = CARD_PALETTES[active]

  return (
    <div className="color-demo">
      <div
        className="color-canvas"
        style={{
          background: `radial-gradient(circle at 28% 30%, ${palette.a}, transparent 62%),
            radial-gradient(circle at 74% 68%, ${palette.b}, transparent 58%),
            var(--surface-2)`,
        }}
        aria-hidden="true"
      />
      <div className="color-meta">
        <span className="color-name">
          {palette.name} <em>{palette.a}</em>
        </span>
        <div className="color-swatches" role="group" aria-label="Card palettes">
          {CARD_PALETTES.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className={`color-swatch ${i === active ? 'is-active' : ''}`}
              style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}
              onClick={() => setActive(i)}
              aria-label={`Palette ${p.name}`}
              data-hover
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- proof: counters that tick up in view ---------- */

function Counter({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) {
      setValue(to)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 1500
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])

  return (
    <div className="stat" ref={ref}>
      <span className="stat-value">
        {value}
        <em>{suffix}</em>
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function StatsCard() {
  return (
    <div className="stats-demo">
      <Counter to={60} suffix="fps" label="every animation, GPU-composited" />
      <Counter to={0} suffix="" label="stock assets — everything drawn here" />
      <Counter to={100} suffix="%" label="handcrafted, down to the cursor" />
    </div>
  )
}

/* ---------- composition: tiles that breathe on hover ---------- */

function LayoutCard() {
  return (
    <div className="layout-demo" aria-hidden="true">
      <div className="layout-row">
        <span className="layout-tile" />
        <span className="layout-tile is-accent" />
        <span className="layout-tile" />
      </div>
      <div className="layout-row">
        <span className="layout-tile" />
        <span className="layout-tile is-soft" />
      </div>
    </div>
  )
}

/* ---------- section ---------- */

export default function Craft() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.08 })

  return (
    <section className="craft" id="craft">
      <div className="container">
        <SectionHead
          index="01"
          label="The craft"
          note="Six small machines. Touch everything — every card tilts, lights up and answers back."
        >
          Details <span className="serif">are</span> the design
        </SectionHead>

        <div ref={ref} className={`bento ${inView ? 'is-in' : ''}`}>
          <BentoCard className="bento-type" label="Typography" index={0}>
            <TypeCard />
          </BentoCard>
          <BentoCard className="bento-motion" label="Motion" index={1}>
            <MotionCard />
          </BentoCard>
          <BentoCard className="bento-toggle" label="Microinteraction" index={2}>
            <ToggleCard />
          </BentoCard>
          <BentoCard className="bento-color" label="Color" index={3}>
            <ColorCard />
          </BentoCard>
          <BentoCard className="bento-stats" label="Obsession, measured" index={4}>
            <StatsCard />
          </BentoCard>
          <BentoCard className="bento-layout" label="Composition" index={5}>
            <LayoutCard />
          </BentoCard>
        </div>
      </div>
    </section>
  )
}
