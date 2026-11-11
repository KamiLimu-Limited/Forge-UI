import { FeedbackSummary } from '@/components/forge/FeedbackSummary'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { StatTile } from '@/components/ui/StatTile'
import { formatDay } from '@/lib/format'
import { PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'
import { plural } from '@/lib/format'
import type { SessionRatingsView } from '@/types/peerMentor'

interface SessionRatingsScreenProps {
  // null until the data loads
  data: SessionRatingsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// How everyone who attended rated one session the peer mentor led or co-led.
export function SessionRatingsScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: SessionRatingsScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={PEER_MENTOR_ROUTES.facilitator}>Back to facilitator view</BackLink>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading this session's ratings" />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.session.pillar && (
              <span>
                <TrackBadge pillar={data.session.pillar} />
              </span>
            )}
            <PageHeader
              title={data.session.title}
              subtitle={`${formatDay(data.session.startsAt)}. ${plural(data.session.responses, 'rating')} from people who attended.`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
            <StatTile
              label="Average for this session"
              value={data.session.average?.toFixed(1) ?? null}
            />
            <StatTile
              label="Your average across sessions"
              value={data.averageAcrossSessions?.toFixed(1) ?? null}
            />
            <StatTile label="All peer mentors" value={data.peerAverage?.toFixed(1) ?? null} />
          </div>
          {data.session.average === null ? (
            <Card>
              <EmptyState
                icon="users"
                title="No ratings yet"
                description="Nobody who attended has rated this session."
              />
            </Card>
          ) : (
            <FeedbackSummary
              groups={data.session.groups}
              feedback={data.session.feedback}
              showResponseCount
            />
          )}
        </>
      )}
    </div>
  )
}
