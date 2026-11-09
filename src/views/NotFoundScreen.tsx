import { AuthLayout } from '@/components/layout/AuthLayout'
import { ButtonLink } from '@/components/ui/ButtonLink'

interface NotFoundScreenProps {
  // Signed-out visitors go to sign in instead of a home
  isSignedIn: boolean
  homeHref: string
}

export function NotFoundScreen({ isSignedIn, homeHref }: NotFoundScreenProps) {
  return (
    <AuthLayout
      title="Page not found"
      description="The link may be mistyped, or the page may have moved."
    >
      <ButtonLink href={isSignedIn ? homeHref : '/login'} size="lg" fullWidth>
        {isSignedIn ? 'Go to your home' : 'Go to sign in'}
      </ButtonLink>
    </AuthLayout>
  )
}
