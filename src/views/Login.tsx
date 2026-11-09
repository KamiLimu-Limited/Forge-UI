'use client'

import { useLoginForm } from '@/hooks/useLoginForm'
import { LoginScreen } from './LoginScreen'

export function Login() {
  const form = useLoginForm()
  return (
    <LoginScreen
      email={form.email}
      password={form.password}
      emailError={form.emailError}
      passwordError={form.passwordError}
      isSuspended={form.isSuspended}
      isSubmitting={form.isSubmitting}
      onEmailChange={form.setEmail}
      onPasswordChange={form.setPassword}
      onSubmit={(e) => {
        void form.submit(e)
      }}
    />
  )
}
