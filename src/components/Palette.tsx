import { useEffect, useState, type CSSProperties } from 'react'
import SectionHead from './SectionHead'
import { useInView } from '../hooks/useInView'
import './Palette.css'

interface Theme {
  key: string
  name: string
  desc: string
  colors: [string, string, string]
}

const THEMES: Theme[] = [
  {
    key: 'voltage',
    name: 'Voltage',
    desc: 'Electric lime with lavender undertones. The house default.',
    colors: ['#cdff57', '#b3a0ff', '#ff9e7a'],
  },
  {
    key: 'twilight',
    name: 'Twilight',
    desc: 'Soft violet cut with glacial cyan. Calm, late, luminous.',
    colors: ['#b3a0ff', '#7ee8fa', '#cdff57'],
  },
  {
    key: 'ember',
    name: 'Ember',
    desc: 'Warm peach and honey gold. A slow sunset in UI form.',
    colors: ['#ff9e7a', '#ffd27a', '#b3a0ff'],
  },
  {
    key: 'glacier',
    name: 'Glacier',
    desc: 'Cold cyan sharpened by lime. Crisp air, clear head.',
    colors: ['#7ee8fa', '#cdff57', '#ff9e7a'],
  },
]

/**
 * Live color system: picking a mood swaps the CSS custom properties on the
 * root element, re-lighting every accent on the page at once.
 */
export default function Palette() {
  const [active, setActive] = useState('voltage')
  const [copied, setCopied] = useState<string | null>(null)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 })

  useEffect(() => {
    const root = document.documentElement
    if (active === 'voltage') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = active
    }
    return () => {
      delete root.dataset.theme
    }
  }, [active])

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200)
    } catch {
      /* clipboard unavailable — the chip still shows the value */
    }
  }

  return (
    <section className="palette" id="colors">
      <div className="container">
        <SectionHead
          index="04"
          label="Color system"
          note="Click a mood — every accent on the page re-lights itself. Hex chips copy on click."
        >
          One site, <span className="serif">four moods</span>
        </SectionHead>

        <div ref={ref} className={`palette-grid ${inView ? 'is-in' : ''}`}>
          {THEMES.map((theme, i) => (
            <article
              key={theme.key}
              className={`theme-card reveal ${active === theme.key ? 'is-active' : ''}`}
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
            >
              <button
                type="button"
                className="theme-card-hit"
                onClick={() => setActive(theme.key)}
                aria-pressed={active === theme.key}
                data-hover
              >
                <span className="theme-swatches" aria-hidden="true">
                  {theme.colors.map((color, ci) => (
                    <span
                      key={color}
                      className="theme-swatch"
                      style={{ background: color, zIndex: 3 - ci }}
                    />
                  ))}
                </span>
                <span className="theme-name">
                  {theme.name}
                  {active === theme.key && <em className="theme-active-tag">— live</em>}
                </span>
                <span className="theme-desc">{theme.desc}</span>
              </button>
              <div className="theme-hexes" role="group" aria-label={`${theme.name} hex values`}>
                {theme.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="theme-hex"
                    onClick={() => copy(color)}
                    data-hover
                  >
                    {copied === color ? 'copied ✓' : color}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
