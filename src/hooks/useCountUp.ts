'use client'

import { useEffect, useState } from 'react'

const DURATION_MS = 1600

// Counts from 0 to `target` while `run` is true. With reduced motion it shows the number
// straight away.
export function useCountUp(target: number, run: boolean, reduced: boolean): number {
  const [value, setValue] = useState(reduced ? target : 0)
  useEffect(() => {
    if (reduced || !run) {
      setValue(reduced ? target : 0)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, run, reduced])
  return value
}
