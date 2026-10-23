'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { validateNewPassword } from '@/lib/password'
import { ApiError } from '@/types/auth'

type ResetStatus = 'idle' | 'submitting' | 'done'

const REDIRECT_DELAY_MS = 2500

interface UseResetPasswordReturn {
  password: string
  confirm: string
  error: string | null
  status: ResetStatus
  setPassword: (value: string) => void
  setConfirm: (value: string) => void
  submit: (e: FormEvent) => Promise<void>
}

// Sets a new password from a reset link, then sends the user to sign in
export function useResetPassword(token: string): UseResetPasswordReturn {
  const router = useRouter()
  const [password, setPasswordValue] = useState('')
  const [confirm, setConfirmValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<ResetStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validateNewPassword(password, confirm)
    setError(problem)
    if (problem) return

    setStatus('submitting')
    try {
      await api.auth.resetPassword({ token, new_password: password })
      setStatus('done')
      timer.current = setTimeout(() => router.replace('/login'), REDIRECT_DELAY_MS)
    } catch (err) {
      setError(err instanceof ApiError ? err.body.error : 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return {
    password,
    confirm,
    error,
    status,
    setPassword: (value) => {
      setPasswordValue(value)
      setError(null)
    },
    setConfirm: (value) => {
      setConfirmValue(value)
      setError(null)
    },
    submit,
  }
}
