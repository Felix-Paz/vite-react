import { Fragment, type CSSProperties } from 'react'
import './Marquee.css'

interface MarqueeProps {
  items: string[]
  reverse?: boolean
  className?: string
  /** seconds for one full loop */
  duration?: number
}

/** Infinite horizontal ticker built from two identical groups. */
export default function Marquee({
  items,
  reverse = false,
  className = '',
  duration = 26,
}: MarqueeProps) {
  const group = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {[0, 1, 2].map((rep) => (
        <Fragment key={rep}>
          {items.map((item, i) => (
            <Fragment key={`${rep}-${i}`}>
              <span className="marquee-item">{item}</span>
              <span className="marquee-sep" aria-hidden="true">
                ✳
              </span>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  )

  return (
    <div
      className={`marquee ${reverse ? 'is-reverse' : ''} ${className}`}
      style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
    >
      {group(false)}
      {group(true)}
    </div>
  )
}
