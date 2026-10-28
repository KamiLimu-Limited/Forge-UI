'use client'

import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'
import { errorMessage } from '@/lib/errors'

export interface ApiQuery<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  // Replace the loaded data without refetching, for example after a save
  setData: (next: T | null) => void
}

// Runs `load` when `deps` change and tracks loading and error state.
// Pass `enabled: false` to wait, for example until a cohort is chosen.
export function useApiQuery<T>(
  load: () => Promise<T>,
  deps: DependencyList,
  options: { enabled?: boolean; fallbackError?: string } = {}
): ApiQuery<T> {
  const { enabled = true, fallbackError = "We couldn't load this. Try again." } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const loadRef = useRef(load)
  loadRef.current = load

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    setError(null)
    loadRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(errorMessage(err, fallbackError))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tick, fallbackError, ...deps])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { data, isLoading, error, refetch, setData }
}
