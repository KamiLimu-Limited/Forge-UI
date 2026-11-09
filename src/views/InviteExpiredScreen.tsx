import { AuthLayout } from '@/components/layout/AuthLayout'
import { ButtonLink } from '@/components/ui/ButtonLink'

// Shown in place of the activation form when the invitation link expired, was used, or
// was never valid
export function InviteExpiredScreen() {
  return (
    <AuthLayout
      title="This invitation link no longer works"
      description="It has expired or has already been used. Invitation links last 7 days and work once."
    >
      <ButtonLink href="/login" size="lg" fullWidth>
        I&apos;ve already activated, sign in
      </ButtonLink>
      <p className="font-sans text-small text-text-secondary">
        Haven&apos;t activated yet? Ask the System Admin to resend your invitation. The new email
        has a fresh link.
      </p>
    </AuthLayout>
  )
}
