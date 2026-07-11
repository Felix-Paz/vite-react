import { useInView } from '../hooks/useInView'

interface SplitTextProps {
  text: string
  className?: string
  /** ms before the first character starts */
  delay?: number
  /** ms between characters */
  step?: number
  /** externally control the reveal; when omitted, reveals on scroll into view */
  active?: boolean
}

/**
 * Splits a string into per-character spans, each masked by its word wrapper,
 * so the text rises into view with a staggered rotation.
 */
export default function SplitText({
  text,
  className = '',
  delay = 0,
  step = 28,
  active,
}: SplitTextProps) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const on = active ?? inView
  let charIndex = 0

  return (
    <span
      ref={ref}
      className={`split ${on ? 'is-in' : ''} ${className}`}
      aria-label={text}
      role="text"
    >
      {text.split(' ').map((word, wi) => (
        <span className="split-word" key={wi} aria-hidden="true">
          {word.split('').map((char, ci) => (
            <span
              className="split-char"
              key={ci}
              style={{ transitionDelay: `${delay + charIndex++ * step}ms` }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}
