'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/types/auth'

interface UseLoginFormReturn {
  email: string
  password: string
  emailError: string | null
  passwordError: string | null
  isSubmitting: boolean
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  submit: (e: FormEvent) => Promise<void>
}

export function useLoginForm(): UseLoginFormReturn {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmailValue] = useState('')
  const [password, setPasswordValue] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const emailProblem =
      !email.trim() || !email.includes('@') ? 'Enter a valid email address.' : null
    const passwordProblem = password ? null : 'Enter your password.'
    setEmailError(emailProblem)
    setPasswordError(passwordProblem)
    if (emailProblem || passwordProblem) return

    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      router.replace('/dashboard')
    } catch (err) {
      setPasswordError(
        err instanceof ApiError ? err.body.error : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    password,
    emailError,
    passwordError,
    isSubmitting,
    setEmail: (value) => {
      setEmailValue(value)
      setEmailError(null)
    },
    setPassword: (value) => {
      setPasswordValue(value)
      setPasswordError(null)
    },
    submit,
  }
}
