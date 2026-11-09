import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { formatDay, formatTimeRange } from '@/lib/format'
import {
  MENTEE_ROUTES,
  menteeAttendanceRoute,
  menteeExtensionRoute,
  menteeNotesRoute,
} from '@/lib/menteeRoutes'
import type { SessionDetailView } from '@/types/menteeSessions'

interface SessionDetailScreenProps {
  // null until the data loads
  session: SessionDetailView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

function AttendanceAction({ session }: { session: SessionDetailView }) {
  const hasSubmitted = session.recordState !== null && session.recordState !== 'pending'
  if (hasSubmitted) {
    return (
      <div className="flex flex-col gap-3">
        <Notice>You&apos;ve submitted your attendance for this session.</Notice>
        <ButtonLink href={MENTEE_ROUTES.sessionHistory} variant="secondary" size="lg" fullWidth>
          View in history
        </ButtonLink>
      </div>
    )
  }
  if (session.windowState === 'open') {
    return (
      <ButtonLink href={menteeAttendanceRoute(session.id)} variant="secondary" size="lg" fullWidth>
        Mark attendance
      </ButtonLink>
    )
  }
  if (session.windowState === 'upcoming') {
    return (
      <Button variant="secondary" size="lg" fullWidth disabled>
        Mark attendance, {session.opensLabel.charAt(0).toLowerCase() + session.opensLabel.slice(1)}
      </Button>
    )
  }
  return (
    <ButtonLink href={menteeExtensionRoute(session.id)} variant="secondary" size="lg" fullWidth>
      Request extension
    </ButtonLink>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-5 gap-3 font-sans text-small">
      <dt className="col-span-2 text-text-secondary">{label}</dt>
      <dd className="col-span-3 text-text-primary">{value}</dd>
    </div>
  )
}

// One session for a mentee: joining, attendance, details, mentors and materials.
// This only draws the screen; the page's hook loads the data.
export function SessionDetailScreen({
  session,
  isLoading = false,
  error = null,
  onRetry,
}: SessionDetailScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={MENTEE_ROUTES.sessions}>Back to sessions</BackLink>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !session ? (
        <LoadingState label="Loading this session" />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {session.pillar && (
              <span>
                <TrackBadge pillar={session.pillar} />
              </span>
            )}
            <PageHeader
              title={session.title}
              subtitle={
                session.startsSoonLabel ??
                `${formatDay(session.startsAt)}, ${formatTimeRange(session.startsAt, session.endsAt)}`
              }
            />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-5 lg:gap-5">
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-3 lg:gap-5">
              <Card>
                <div className="flex flex-col gap-3">
                  {session.isVirtual && (
                    <div className="flex flex-col gap-1">
                      <Button size="lg" fullWidth disabled>
                        Join Google Meet
                      </Button>
                      <p className="font-sans text-caption text-text-muted">Not available yet</p>
                    </div>
                  )}
                  <AttendanceAction session={session} />
                  {session.windowClosesLabel && (
                    <p className="font-sans text-small text-text-secondary">
                      Attendance opens when the session starts and closes{' '}
                      <strong className="font-semibold text-text-primary">
                        {session.windowClosesLabel}
                      </strong>
                      .
                    </p>
                  )}
                </div>
              </Card>
              <Card title="Details">
                <div className="flex flex-col gap-3">
                  <dl className="flex flex-col gap-2">
                    <Detail
                      label="When"
                      value={`${formatDay(session.startsAt)}, ${formatTimeRange(session.startsAt, session.endsAt)}`}
                    />
                    <Detail label="Where" value={session.whereLabel} />
                    <Detail label="Type" value={session.typeLabel} />
                    <Detail label="Points" value={String(session.points)} />
                    <Detail label="KamiLimu month" value={`Month ${session.month}`} />
                  </dl>
                  {session.movedNote && <Notice>{session.movedNote}</Notice>}
                </div>
              </Card>
            </div>

            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2 lg:gap-5">
              <Card title="Mentors">
                {session.mentors.length === 0 ? (
                  <p className="font-sans text-small text-text-muted">No mentors listed yet.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {session.mentors.map((mentor) => (
                      <li
                        key={`${mentor.name}-${mentor.roleLabel}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={mentor.name} />
                        <div className="min-w-0">
                          <p className="font-sans text-small font-semibold text-text-primary">
                            {mentor.name}
                          </p>
                          <p className="font-sans text-caption text-text-secondary">
                            {mentor.roleLabel}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card title="Materials and notes">
                <div className="flex flex-col gap-2">
                  {session.materials.length === 0 ? (
                    <p className="font-sans text-small text-text-muted">No materials yet.</p>
                  ) : (
                    session.materials.map((material) => (
                      <a
                        key={material.url}
                        href={material.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-control flex-col justify-center rounded-md px-1 text-inherit no-underline hover:bg-background hover:no-underline"
                      >
                        <span className="font-sans text-small font-semibold text-link">
                          {material.title}
                        </span>
                        <span className="font-sans text-caption text-text-secondary">
                          {material.kindLabel}
                        </span>
                      </a>
                    ))
                  )}
                  <ButtonLink href={menteeNotesRoute(session.id)} variant="secondary" fullWidth>
                    Open your notes
                  </ButtonLink>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
