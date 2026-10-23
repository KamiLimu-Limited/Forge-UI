'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { ApiError } from '@/types/auth'
import type { UserInviteRequest } from '@/types/auth'

interface UseInviteUserReturn {
  invite: (body: UserInviteRequest) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
  reset: () => void
}

export function useInviteUser(): UseInviteUserReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const invite = async (body: UserInviteRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.auth.invite(body)
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : 'Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
  }

  return { invite, isLoading, error, success, reset }
}
