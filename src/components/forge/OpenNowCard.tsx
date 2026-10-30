import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { TextLink } from '@/components/ui/TextLink'
import { formatDay, plural } from '@/lib/format'
import { MENTEE_ROUTES, menteeAttendanceRoute } from '@/lib/menteeRoutes'
import type { OpenSession } from '@/types/home'

interface OpenNowCardProps {
  sessions: OpenSession[]
}

// Sessions whose attendance form is still open
export function OpenNowCard({ sessions }: OpenNowCardProps) {
  return (
    <Card
      title="Open now"
      flush
      action={
        <TextLink href={MENTEE_ROUTES.sessions} layout="inline">
          All sessions
        </TextLink>
      }
    >
      {sessions.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Nothing open right now"
          description="Sessions show up here while their attendance form is open."
        />
      ) : (
        <ul className="px-4 pb-2 md:px-6">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="font-sans text-body font-semibold text-text-primary">
                  {session.title}
                </p>
                <p className="font-sans text-small text-text-muted">
                  {[
                    formatDay(session.startsAt),
                    session.leaderName && `with ${session.leaderName}`,
                    plural(session.points, 'point'),
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Chip variant="warn">{session.closesInLabel}</Chip>
                <ButtonLink href={menteeAttendanceRoute(session.id)} size="sm">
                  Attend
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
