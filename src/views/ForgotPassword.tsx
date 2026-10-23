'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ApiError } from '@/types/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type PageState = 'idle' | 'submitting' | 'sent'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<PageState>('idle')
  const [fieldError, setFieldError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldError(null)

    if (!email.trim() || !email.includes('@')) {
      setFieldError('Enter a valid email address.')
      return
    }

    setState('submitting')
    try {
      await api.auth.requestReset({ email: email.trim() })
      setState('sent')
    } catch (err) {
      // API always returns success — only network errors reach here
      if (err instanceof ApiError) {
        setFieldError(err.body.error)
      } else {
        setFieldError('Something went wrong. Please try again.')
      }
      setState('idle')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-background"
    >
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-heading font-bold text-teal-500">Forge</span>
          <span className="font-mono text-caption tracking-[0.2em] uppercase text-text-muted">
            by KamiLimu
          </span>
        </div>

        {state === 'sent' ? (
          <div className="flex flex-col gap-4">
            <h1 className="font-mono text-heading font-bold text-text-primary">Check your email.</h1>
            <p className="font-sans text-body text-text-secondary leading-relaxed">
              If an account exists for{' '}
              <span className="text-teal-500 font-semibold">{email}</span>, a password reset link
              has been sent. The link expires in 24 hours.
            </p>
            <Link
              href="/login"
              className="font-mono text-caption text-teal-500 hover:text-teal-300 mt-2"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => { void handleSubmit(e) }} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-mono text-heading font-bold text-text-primary">
                Reset your password.
              </h1>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Enter your email address and we will send you a reset link.
              </p>
            </div>

            <Input
              label="Email Address"
              type="email"
              id="email"
              placeholder="yourname@university.ac.ke"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFieldError(null)
              }}
              error={fieldError ?? undefined}
              autoFocus
              required
            />

            <Button type="submit" fullWidth size="lg" isLoading={state === 'submitting'}>
              Send Reset Link
            </Button>

            <Link
              href="/login"
              className="font-mono text-caption text-text-muted hover:text-teal-500 text-center transition-colors duration-fast"
            >
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
