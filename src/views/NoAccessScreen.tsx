import { AuthLayout } from '@/components/layout/AuthLayout'
import { ButtonLink } from '@/components/ui/ButtonLink'

interface NoAccessScreenProps {
  // Who the page is for, as it reads after "It's for", such as "the System Admin"
  area: string
  fullName: string
  // The person's roles, such as "Mentee"
  roleLabel: string
  homeHref: string
}

// Shown when a signed-in person opens a page their roles don't cover
export function NoAccessScreen({ area, fullName, roleLabel, homeHref }: NoAccessScreenProps) {
  return (
    <AuthLayout
      title="You can't open this page"
      description={
        <>
          It&apos;s for {area}. You&apos;re signed in as{' '}
          <strong className="font-semibold text-text-primary">{fullName}</strong>
          {roleLabel ? `, ${roleLabel}` : ''}.
        </>
      }
    >
      <ButtonLink href={homeHref} size="lg" fullWidth>
        Go to your home
      </ButtonLink>
      <p className="font-sans text-small text-text-secondary">
        If you need this page for your role, ask the System Admin.
      </p>
    </AuthLayout>
  )
}
