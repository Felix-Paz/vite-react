import { type CSSProperties, type ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface SectionHeadProps {
  index: string
  label: string
  children: ReactNode
  note?: string
}

/** Consistent section opener: hairline eyebrow with index, oversized title. */
export default function SectionHead({ index, label, children, note }: SectionHeadProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className={`section-head ${inView ? 'is-in' : ''}`}>
      <p className="eyebrow reveal">
        <span className="eyebrow-index">{index}</span>
        {label}
      </p>
      <h2 className="section-title">{children}</h2>
      {note && (
        <p className="reveal section-note" style={{ '--d': '180ms' } as CSSProperties}>
          {note}
        </p>
      )}
    </div>
  )
}
