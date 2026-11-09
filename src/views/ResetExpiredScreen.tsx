import { AuthLayout } from '@/components/layout/AuthLayout'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { TextLink } from '@/components/ui/TextLink'

// Shown in place of the new password form when the reset link expired, was used, or was
// never valid
export function ResetExpiredScreen() {
  return (
    <AuthLayout
      title="This reset link no longer works"
      description="It has expired or has already been used. Reset links work once, within 24 hours."
    >
      <ButtonLink href="/forgot-password" size="lg" fullWidth>
        Send a new reset link
      </ButtonLink>
      <TextLink href="/login">Back to sign in</TextLink>
    </AuthLayout>
  )
}
