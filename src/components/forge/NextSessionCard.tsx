import { TrackBadge } from '@/components/forge/TrackBadge'
import { buttonClasses } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TextLink } from '@/components/ui/TextLink'
import { cx } from '@/lib/cx'
import { formatDay, formatTime, formatTimeRange } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { NextSession } from '@/types/home'

interface NextSessionCardProps {
  session: NextSession | null
  // From md up, puts "All sessions" in the header. Use it when no "Open now" card
  // sits beside this one to carry that link.
  allSessionsInHeader?: boolean
  className?: string
}

export function NextSessionCard({
  session,
  allSessionsInHeader = false,
  className,
}: NextSessionCardProps) {
  const allSessions = (
    <div className={cx(allSessionsInHeader && 'md:hidden')}>
      <TextLink href={MENTEE_ROUTES.sessions}>All sessions</TextLink>
    </div>
  )

  return (
    <Card
      title="Next session"
      className={className}
      action={
        <>
          {session?.pillar && (
            <span className="md:hidden">
              <TrackBadge pillar={session.pillar} />
            </span>
          )}
          {allSessionsInHeader && (
            <span className="hidden md:inline">
              <TextLink href={MENTEE_ROUTES.sessions} layout="inline">
                All sessions
              </TextLink>
            </span>
          )}
        </>
      }
    >
      {session ? (
        <>
          <p className="font-sans text-body font-semibold text-text-primary">{session.title}</p>
          <p className="font-sans text-small text-text-secondary">
            {formatDay(session.startsAt)},{' '}
            {session.endsAt
              ? formatTimeRange(session.startsAt, session.endsAt)
              : formatTime(session.startsAt)}
          </p>
          <div className="mt-2 flex items-center gap-3 md:hidden">
            {session.materialsUrl && (
              <a
                href={session.materialsUrl}
                target="_blank"
                rel="noreferrer"
                className={cx(
                  buttonClasses('secondary', 'sm', false),
                  'no-underline hover:no-underline'
                )}
              >
                Open materials
              </a>
            )}
            {allSessions}
          </div>
          {(session.pillar ?? session.materialsUrl) && (
            <div className="mt-3 hidden items-center gap-3 md:flex">
              {session.pillar && <TrackBadge pillar={session.pillar} />}
              {session.materialsUrl && (
                <a
                  href={session.materialsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="relative font-sans text-caption font-semibold text-link before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] hover:underline"
                >
                  Open materials
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="font-sans text-small text-text-secondary">
            Your next session shows up here once it is scheduled.
          </p>
          {allSessions}
        </>
      )}
    </Card>
  )
}
