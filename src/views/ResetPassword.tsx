'use client'

import { type FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { ApiError } from '@/types/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

function validate(password: string, confirm: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.'
  if (!/\d/.test(password)) return 'Password must include at least one digit.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}

type PageState = 'idle' | 'submitting' | 'done'

export function ResetPassword() {
  const params = useSearchParams()
  const router = useRouter()

  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [pageState, setPageState] = useState<PageState>('idle')
  const [tokenError, setTokenError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) setTokenError('Reset link is missing or invalid. Request a new one.')
  }, [token])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFieldError(null)

    const err = validate(password, confirm)
    if (err) {
      setFieldError(err)
      return
    }

    setPageState('submitting')
    try {
      await api.auth.resetPassword({ token, new_password: password })
      setPageState('done')
      setTimeout(() => router.replace('/login'), 2500)
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldError(caught.body.error)
      } else {
        setFieldError('Something went wrong. Please try again.')
      }
      setPageState('idle')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: 'var(--color-black)' }}
    >
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col gap-1">
          <span className="font-mono text-heading font-bold text-teal-500">Forge</span>
          <span className="font-mono text-caption tracking-[0.2em] uppercase text-text-muted">
            by KamiLimu
          </span>
        </div>

        {tokenError ? (
          <div className="flex flex-col gap-4">
            <p className="font-sans text-body text-auburn">{tokenError}</p>
            <Link
              href="/forgot-password"
              className="font-mono text-caption text-teal-500 hover:text-teal-300"
            >
              Request a new reset link
            </Link>
          </div>
        ) : pageState === 'done' ? (
          <div className="flex flex-col gap-4">
            <h1 className="font-mono text-heading font-bold text-text-primary">
              Password updated.
            </h1>
            <p className="font-sans text-body text-text-secondary leading-relaxed">
              Your password has been reset. Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => { void handleSubmit(e) }} noValidate className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-mono text-heading font-bold text-text-primary">
                Set a new password.
              </h1>
              <p className="font-sans text-body text-text-secondary leading-relaxed">
                Choose a strong password for your Forge account.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="New Password"
                type="password"
                id="new-password"
                placeholder="············"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFieldError(null)
                }}
                autoFocus
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                id="confirm-password"
                placeholder="············"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value)
                  setFieldError(null)
                }}
                error={fieldError ?? undefined}
                required
              />
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={pageState === 'submitting'}>
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
