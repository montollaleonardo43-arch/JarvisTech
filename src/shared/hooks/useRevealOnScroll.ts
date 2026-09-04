import { useEffect } from 'react'

export function useRevealOnScroll(deps: unknown[] = []) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    if (elements.length === 0) return

    const revealAll = () => elements.forEach((el) => el.classList.add('in-view'))

    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))

    // Safety net: never leave items hidden (e.g. elements added after mount
    // or observers that fail to fire). Reveal everything shortly after.
    const fallbackTimer = setTimeout(revealAll, 2000)

    return () => {
      clearTimeout(fallbackTimer)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
