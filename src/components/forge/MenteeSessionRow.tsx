import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Chip } from '@/components/ui/Chip'
import { formatDay, formatTimeRange, plural } from '@/lib/format'
import { menteeAttendanceRoute, menteeNotesRoute } from '@/lib/menteeRoutes'
import type { OpenSession } from '@/types/home'
import type { UpcomingSession } from '@/types/menteeSessions'
import { TrackBadge } from './TrackBadge'

type MenteeSessionRowProps =
  | { kind: 'open'; session: OpenSession }
  | { kind: 'upcoming'; session: UpcomingSession }

// One session the mentee can act on. A card of its own on phones, a row from md up.
// Attend only works while the window is open; the server checks that again on submit.
export function MenteeSessionRow(props: MenteeSessionRowProps) {
  const { session } = props
  const when = `${formatDay(session.startsAt)}, ${formatTimeRange(session.startsAt, session.endsAt)}`
  const badge = session.pillar && <TrackBadge pillar={session.pillar} />

  return (
    <article className="flex flex-col gap-2.5 rounded-lg border border-border bg-surface p-4 shadow-card md:flex-row md:items-center md:gap-5 md:rounded-none md:border-0 md:border-b md:bg-transparent md:px-0 md:py-4 md:shadow-none md:last:border-b-0">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <span>{badge}</span>
        {props.kind === 'open' ? (
          <Chip variant="warn">{props.session.closesInLabel}</Chip>
        ) : (
          <span className="font-sans text-small text-text-muted">{props.session.dayLabel}</span>
        )}
      </div>

      <div className="min-w-0 md:flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-sans text-body font-semibold text-text-primary">{session.title}</h3>
          <span className="hidden md:inline">{badge}</span>
        </div>
        <p className="font-sans text-small text-text-secondary">{when}</p>
        {props.kind === 'open' && (
          <p className="font-sans text-small text-text-secondary">
            {[
              props.session.leaderName && `With ${props.session.leaderName}`,
              plural(props.session.points, 'point'),
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}
      </div>

      <div className="hidden w-48 shrink-0 md:block">
        {props.kind === 'open' ? (
          <Chip variant="warn">{props.session.closesInLabel}</Chip>
        ) : (
          <span className="font-sans text-small text-text-muted">{props.session.opensLabel}</span>
        )}
      </div>

      <div className="flex items-center gap-2 md:shrink-0">
        <ButtonLink
          href={menteeNotesRoute(session.id)}
          variant="secondary"
          aria-label={`Notes for ${session.title}`}
          className="order-2 md:order-1"
        >
          Notes
        </ButtonLink>
        {props.kind === 'open' ? (
          <ButtonLink
            href={menteeAttendanceRoute(session.id)}
            aria-label={`Attend ${session.title}`}
            className="order-1 flex-1 md:order-2 md:flex-none"
          >
            Attend
          </ButtonLink>
        ) : (
          <Button
            disabled
            className="order-1 min-w-0 flex-1 !px-2 md:order-2 md:flex-none md:!px-4"
          >
            {/* Smaller on phones so a long date leaves room for Notes */}
            <span className="text-caption md:hidden">{props.session.opensLabel}</span>
            <span className="hidden md:inline">Attend</span>
          </Button>
        )}
      </div>
    </article>
  )
}
