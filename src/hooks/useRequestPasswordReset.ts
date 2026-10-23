'use client'

import { useState, type FormEvent } from 'react'
import { api } from '@/lib/api'
import { ApiError } from '@/types/auth'

type ResetRequestStatus = 'idle' | 'submitting' | 'sent'

interface UseRequestPasswordResetReturn {
  email: string
  error: string | null
  status: ResetRequestStatus
  setEmail: (value: string) => void
  submit: (e: FormEvent) => Promise<void>
}

export function useRequestPasswordReset(): UseRequestPasswordResetReturn {
  const [email, setEmailValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<ResetRequestStatus>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    setStatus('submitting')
    try {
      await api.auth.requestReset({ email: email.trim() })
      setStatus('sent')
    } catch (err) {
      // The API always answers with success, so only network problems land here
      setError(err instanceof ApiError ? err.body.error : 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return {
    email,
    error,
    status,
    setEmail: (value) => {
      setEmailValue(value)
      setError(null)
    },
    submit,
  }
}
