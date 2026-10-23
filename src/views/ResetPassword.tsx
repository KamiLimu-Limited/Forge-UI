'use client'

import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { TextLink } from '@/components/ui/TextLink'
import { useResetPassword } from '@/hooks/useResetPassword'
import { PASSWORD_RULES } from '@/lib/password'

export function ResetPassword() {
  const token = useSearchParams().get('token') ?? ''
  const form = useResetPassword(token)

  if (!token) {
    return (
      <AuthLayout title="Set a new password">
        <p role="alert" className="font-sans text-body text-danger-text">
          This reset link is missing or invalid.
        </p>
        <TextLink href="/forgot-password">Request a new link</TextLink>
      </AuthLayout>
    )
  }

  if (form.status === 'done') {
    return (
      <AuthLayout title="Password updated">
        <p role="status" className="font-sans text-body text-text-secondary">
          Taking you to sign in.
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set a new password">
      <form
        onSubmit={(e) => {
          void form.submit(e)
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <PasswordInput
          label="New password"
          id="new-password"
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          rules={PASSWORD_RULES}
          autoComplete="new-password"
          autoFocus
          required
        />
        <PasswordInput
          label="Confirm new password"
          id="confirm-password"
          value={form.confirm}
          onChange={(e) => form.setConfirm(e.target.value)}
          error={form.error ?? undefined}
          autoComplete="new-password"
          required
        />
        <Button type="submit" size="lg" fullWidth isLoading={form.status === 'submitting'}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  )
}
