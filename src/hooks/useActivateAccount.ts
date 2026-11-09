'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { api, tokenStore } from '@/lib/api'
import { isDeadInvitation } from '@/lib/authErrors'
import { validateNewPassword } from '@/lib/password'
import { ApiError } from '@/types/auth'

// checking: the link is being looked up. dead: it expired, was used, or was never valid.
export type InvitationLinkState = 'checking' | 'ready' | 'dead'

interface UseActivateAccountReturn {
  linkState: InvitationLinkState
  password: string
  confirm: string
  error: string | null
  isSubmitting: boolean
  setPassword: (value: string) => void
  setConfirm: (value: string) => void
  submit: (e: FormEvent) => Promise<void>
}

// Sets the invitee's password, stores their tokens, then opens the dashboard
export function useActivateAccount(token: string): UseActivateAccountReturn {
  const [password, setPasswordValue] = useState('')
  const [confirm, setConfirmValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkState, setLinkState] = useState<InvitationLinkState>(token ? 'checking' : 'dead')

  // Only a dead link ends the form; if the check itself fails, the form still works and
  // the activation call gives the answer
  useEffect(() => {
    if (!token) return
    let cancelled = false
    api.auth
      .previewInvitation(token)
      .then(() => {
        if (!cancelled) setLinkState('ready')
      })
      .catch((err: unknown) => {
        if (!cancelled) setLinkState(isDeadInvitation(err) ? 'dead' : 'ready')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validateNewPassword(password, confirm)
    setError(problem)
    if (problem) return

    setIsSubmitting(true)
    try {
      const tokens = await api.auth.activate({ token, password })
      tokenStore.set(tokens.access_token, tokens.refresh_token)
      // A full page load so AuthProvider reads the new tokens. A client-side push would
      // reach RequireAuth before the provider knows the user and bounce to /login.
      window.location.replace('/dashboard')
    } catch (err) {
      if (isDeadInvitation(err)) setLinkState('dead')
      else
        setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return {
    linkState,
    password,
    confirm,
    error,
    isSubmitting,
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
