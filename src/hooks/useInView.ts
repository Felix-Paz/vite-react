import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Observes an element and reports whether it has entered the viewport.
 * Defaults to firing once — reveal animations shouldn't replay on scroll-up.
 */
export function useInView<T extends HTMLElement>(options: UseInViewOptions = {}) {
  const { threshold = 0.18, rootMargin = '0px 0px -8% 0px', once = true } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
