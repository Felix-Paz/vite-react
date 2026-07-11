import { useEffect, useRef, useState } from 'react'
import Magnetic from './Magnetic'
import './Navbar.css'

const LINKS = [
  { href: '#craft', label: 'Craft' },
  { href: '#work', label: 'Work' },
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#colors', label: 'Colors' },
]

interface NavbarProps {
  ready: boolean
}

/**
 * Fixed glass bar with a reading-progress hairline. Hides while scrolling
 * down, returns on scroll-up. Includes a full-screen overlay menu.
 */
export default function Navbar({ ready }: NavbarProps) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 160 && y > lastY.current)
      lastY.current = y
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={[
          'navbar',
          ready ? 'is-ready' : '',
          hidden && !menuOpen ? 'is-hidden' : '',
          scrolled ? 'is-scrolled' : '',
        ].join(' ')}
      >
        <div className="navbar-progress" ref={progressRef} aria-hidden="true" />
        <nav className="navbar-inner container" aria-label="Main">
          <a className="navbar-logo" href="#top" data-hover>
            <span className="navbar-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <defs>
                  <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--accent)" />
                    <stop offset="1" stopColor="var(--accent-2)" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" fill="url(#logo-g)" />
                <circle cx="12" cy="12" r="4.5" fill="var(--bg)" />
              </svg>
            </span>
            LUMEN®
          </a>

          <ul className="navbar-links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a className="nav-link" href={link.href} data-hover>
                  <span className="nav-link-stack">
                    <span>{link.label}</span>
                    <span aria-hidden="true">{link.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <Magnetic strength={0.25}>
              <a className="btn btn-fill navbar-cta" href="#contact" data-hover>
                <span className="btn-label">Say hi</span>
              </a>
            </Magnetic>
            <button
              className={`navbar-burger ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              data-hover
            >
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <div className={`menu-overlay ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu">
          <ul className="menu-links">
            {[...LINKS, { href: '#contact', label: 'Say hi' }].map((link, i) => (
              <li key={link.href} style={{ transitionDelay: `${menuOpen ? 120 + i * 60 : 0}ms` }}>
                <a href={link.href} data-hover onClick={() => setMenuOpen(false)}>
                  <span className="menu-link-index">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="menu-footer">LUMEN® — design in motion</p>
      </div>
    </>
  )
}
