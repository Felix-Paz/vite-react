import { useEffect, useRef, useState } from 'react'
import './Preloader.css'

const WORDS = ['typography', 'color', 'motion', 'light', 'rhythm', 'craft']

interface PreloaderProps {
  onDone: () => void
}

/** Cinematic entry: a counting loader that peels away to reveal the site. */
export default function Preloader({ onDone }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [exiting, setExiting] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const start = performance.now()
    const duration = 1900
    let raf = 0
    let exitTimer = 0

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        setExiting(true)
        exitTimer = window.setTimeout(onDone, 950)
      }
    }
    raf = requestAnimationFrame(tick)

    const words = window.setInterval(() => {
      if (!doneRef.current) setWordIndex((i) => (i + 1) % WORDS.length)
    }, 300)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(words)
      clearTimeout(exitTimer)
    }
  }, [onDone])

  return (
    <div className={`preloader ${exiting ? 'is-exiting' : ''}`} aria-hidden="true">
      <div className="preloader-inner">
        <span className="preloader-brand">LUMEN®</span>
        <p className="preloader-word">
          loading <em>{WORDS[wordIndex]}</em>
        </p>
        <span className="preloader-count">{progress}</span>
      </div>
      <div className="preloader-bar">
        <div className="preloader-bar-fill" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  )
}
