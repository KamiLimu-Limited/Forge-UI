'use client'

import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { LoadingState } from '@/components/ui/LoadingState'
import { useActivateAccount } from '@/hooks/useActivateAccount'
import { PASSWORD_RULES } from '@/lib/password'
import { InviteExpiredScreen } from './InviteExpiredScreen'

export function Activate() {
  const token = useSearchParams().get('token') ?? ''
  const form = useActivateAccount(token)

  if (form.linkState === 'dead') return <InviteExpiredScreen />
  if (form.linkState === 'checking') {
    return (
      <AuthLayout title="Activate your account">
        <LoadingState label="Checking your invitation link" />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Activate your account"
      description="Set a password to finish setting up your account."
    >
      <form
        onSubmit={(e) => {
          void form.submit(e)
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <PasswordInput
          label="Password"
          id="password"
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          rules={PASSWORD_RULES}
          autoComplete="new-password"
          autoFocus
          required
        />
        <PasswordInput
          label="Confirm password"
          id="confirm-password"
          value={form.confirm}
          onChange={(e) => form.setConfirm(e.target.value)}
          error={form.error ?? undefined}
          autoComplete="new-password"
          required
        />
        <Button type="submit" size="lg" fullWidth isLoading={form.isSubmitting}>
          Activate account
        </Button>
      </form>
    </AuthLayout>
  )
}
