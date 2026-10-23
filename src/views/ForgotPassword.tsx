'use client'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TextLink } from '@/components/ui/TextLink'
import { useRequestPasswordReset } from '@/hooks/useRequestPasswordReset'

export function ForgotPassword() {
  const form = useRequestPasswordReset()

  if (form.status === 'sent') {
    return (
      <AuthLayout
        title="Check your email"
        description={
          <>
            If an account exists for{' '}
            <span className="font-semibold text-text-primary">{form.email.trim()}</span>, we&apos;ve
            sent a reset link. It expires in 24 hours.
          </>
        }
      >
        <TextLink href="/login">Back to sign in</TextLink>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email and we'll send you a reset link."
    >
      <form
        onSubmit={(e) => {
          void form.submit(e)
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => form.setEmail(e.target.value)}
          error={form.error ?? undefined}
          autoComplete="email"
          autoFocus
          required
        />
        <Button type="submit" size="lg" fullWidth isLoading={form.status === 'submitting'}>
          Send reset link
        </Button>
      </form>
      <TextLink href="/login">Back to sign in</TextLink>
    </AuthLayout>
  )
}
