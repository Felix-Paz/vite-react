import { type CSSProperties } from 'react'
import SectionHead from './SectionHead'
import { useInView } from '../hooks/useInView'
import './Manifesto.css'

const PRINCIPLES = [
  {
    index: '01',
    lead: 'Beauty is a',
    accent: 'feature.',
    body: 'Aesthetics are not decoration — they are how an interface earns trust before a single word is read. If it looks careless, it feels careless.',
  },
  {
    index: '02',
    lead: 'Motion is',
    accent: 'meaning.',
    body: 'Animation is grammar, not garnish. Every easing curve on this page answers a question: where did that come from, and where is it going?',
  },
  {
    index: '03',
    lead: 'Details are',
    accent: 'everything.',
    body: 'The last two percent — the cursor, the grain, the way a button breathes — is the difference between something built and something crafted.',
  },
]

function Principle({
  principle,
  flip,
}: {
  principle: (typeof PRINCIPLES)[number]
  flip: boolean
}) {
  const { ref, inView } = useInView<HTMLLIElement>()

  return (
    <li
      ref={ref}
      className={`principle ${flip ? 'is-flipped' : ''} ${inView ? 'is-in' : ''}`}
    >
      <span className="principle-index blur-reveal" aria-hidden="true">
        {principle.index}
      </span>
      <div className="principle-body">
        <h3 className="principle-title blur-reveal" style={{ '--d': '90ms' } as CSSProperties}>
          {principle.lead} <em>{principle.accent}</em>
        </h3>
        <p className="principle-copy blur-reveal" style={{ '--d': '220ms' } as CSSProperties}>
          {principle.body}
        </p>
      </div>
    </li>
  )
}

/** Scroll-driven storytelling: three beliefs, blurring into focus. */
export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="container">
        <SectionHead index="03" label="Manifesto">
          What we <span className="serif">believe</span>
        </SectionHead>
        <ul className="principles">
          {PRINCIPLES.map((principle, i) => (
            <Principle key={principle.index} principle={principle} flip={i % 2 === 1} />
          ))}
        </ul>
      </div>
    </section>
  )
}
