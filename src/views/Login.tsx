'use client'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { TextLink } from '@/components/ui/TextLink'
import { useLoginForm } from '@/hooks/useLoginForm'

export function Login() {
  const form = useLoginForm()

  return (
    <AuthLayout title="Sign in" description="Sign in to your KamiLimu dashboard.">
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
          error={form.emailError ?? undefined}
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
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          error={form.passwordError ?? undefined}
          autoComplete="current-password"
          required
        />
        <Button type="submit" size="lg" fullWidth isLoading={form.isSubmitting}>
          Sign in
        </Button>
      </form>
      <p className="text-center font-sans text-caption text-text-muted">
        Accounts are created by invitation. Check your email for your invite link.
      </p>
    </AuthLayout>
  )
}
