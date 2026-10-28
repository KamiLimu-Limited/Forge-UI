'use client'

import { useCallback, useState } from 'react'
import { errorMessage } from '@/lib/errors'

export interface AsyncAction<A extends unknown[], R> {
  // Resolves to the result, or null when the call failed (the error is in `error`)
  run: (...args: A) => Promise<R | null>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

// Wraps one write call with loading and error state
export function useAsyncAction<A extends unknown[], R>(
  action: (...args: A) => Promise<R>,
  fallbackError = "That didn't work. Try again."
): AsyncAction<A, R> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (...args: A): Promise<R | null> => {
      setIsLoading(true)
      setError(null)
      try {
        return await action(...args)
      } catch (err: unknown) {
        setError(errorMessage(err, fallbackError))
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [action, fallbackError]
  )

  return { run, isLoading, error, clearError: () => setError(null) }
}
