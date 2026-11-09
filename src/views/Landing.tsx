import { AppPreview } from '@/components/forge/AppPreview'
import { KamiLimuLogo } from '@/components/layout/KamiLimuLogo'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Icon } from '@/components/ui/Icon'

// The cover page people see first. The button goes to sign in, which sends anyone
// already signed in on to their dashboard.
export function Landing() {
  return (
    <div className="flex min-h-screen bg-teal-500 p-3 md:p-4">
      <main className="relative flex flex-1 flex-col overflow-hidden bg-surface md:flex-row">
        <div className="relative z-10 flex flex-col justify-center gap-8 px-6 py-12 md:w-1/2 md:gap-10 md:px-14">
          <KamiLimuLogo className="w-40 md:w-48" />
          <h1 className="font-mono text-display font-semibold leading-tight text-text-primary md:text-display-lg">
            Mentorship Management System
          </h1>
          <ButtonLink href="/login" size="lg" className="self-start">
            <span className="flex items-center gap-2">
              Sign in
              <Icon name="arrow-right" />
            </span>
          </ButtonLink>
        </div>
        {/* A preview of the app, drawn from its own styles so it stays sharp */}
        <div className="relative min-h-96 flex-1 overflow-hidden md:min-h-0 md:pt-10">
          <AppPreview />
        </div>
      </main>
    </div>
  )
}
