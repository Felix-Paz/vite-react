import { useEffect, useState } from 'react'
import Magnetic from './Magnetic'
import Marquee from './Marquee'
import SplitText from './SplitText'
import { useInView } from '../hooks/useInView'
import './Footer.css'

const SOCIALS = [
  { label: 'Twitter / X', href: 'https://x.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Email', href: 'mailto:hello@lumen.studio' },
]

function useLocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      )
    format()
    const id = window.setInterval(format, 30_000)
    return () => clearInterval(id)
  }, [])
  return time
}

/** Cinematic close: giant CTA, orbiting magnetic button, clipped wordmark. */
export default function Footer() {
  const time = useLocalTime()
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 })

  return (
    <footer className="footer" id="contact">
      <div className="footer-marquee">
        <Marquee
          items={[
            'Available for select collaborations',
            'hello@lumen.studio',
            'Design in motion',
          ]}
          reverse
          duration={30}
        />
      </div>

      <div ref={ref} className={`footer-inner container ${inView ? 'is-in' : ''}`}>
        <p className="eyebrow reveal">
          <span className="eyebrow-index">05</span>
          Contact
        </p>

        <div className="footer-cta">
          <h2 className="footer-title">
            <span className="footer-title-line">
              <SplitText text="Let's make" step={26} />
            </span>
            <span className="footer-title-line footer-title-serif">
              <SplitText text="something unforgettable" delay={250} step={22} />
            </span>
          </h2>

          <Magnetic strength={0.4} className="footer-orb-wrap reveal">
            <a className="footer-orb" href="mailto:hello@lumen.studio" data-hover>
              <span>
                Say hi
                <em aria-hidden="true"> ↗</em>
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="footer-grid">
          <ul className="footer-socials">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  className="footer-social"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  data-hover
                >
                  <span className="nav-link-stack">
                    <span>{social.label}</span>
                    <span aria-hidden="true">{social.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="footer-meta">
            <span>Local time — {time}</span>
            <span>© 2026 LUMEN®</span>
            <span>Designed &amp; built in the browser. No templates were harmed.</span>
          </div>
        </div>
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        LUMEN®
      </div>
    </footer>
  )
}
