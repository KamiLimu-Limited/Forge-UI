import type { FormEvent } from 'react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { TextLink } from '@/components/ui/TextLink'

interface LoginScreenProps {
  email: string
  password: string
  emailError: string | null
  passwordError: string | null
  isSuspended: boolean
  isSubmitting: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

// The sign in form. This only draws the screen; useLoginForm holds the logic.
export function LoginScreen({
  email,
  password,
  emailError,
  passwordError,
  isSuspended,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginScreenProps) {
  return (
    <AuthLayout title="Sign in" description="Sign in to your KamiLimu dashboard.">
      {isSuspended && (
        <Notice variant="danger">
          This account is suspended. Contact the System Admin to restore access.
        </Notice>
      )}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={emailError ?? undefined}
          autoComplete="email"
          autoFocus
          required
        />
        <PasswordInput
          label="Password"
          id="password"
          labelAside={
            <TextLink href="/forgot-password" layout="inline">
              Forgot password?
            </TextLink>
          }
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          error={passwordError ?? undefined}
          autoComplete="current-password"
          required
        />
        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
      <p className="text-center font-sans text-caption text-text-muted">
        Accounts are created by invitation. Check your email for your invite link.
      </p>
    </AuthLayout>
  )
}
