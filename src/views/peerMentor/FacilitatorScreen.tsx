import Link from 'next/link'
import { RatingTrendChart } from '@/components/forge/RatingTrendChart'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { StatTile } from '@/components/ui/StatTile'
import { formatDay } from '@/lib/format'
import { sessionRatingsRoute } from '@/lib/peerMentorRoutes'
import type { FacilitatorView } from '@/types/peerMentor'

const NOT_AVAILABLE = 'Not available yet'

interface FacilitatorScreenProps {
  // null until the data loads
  data: FacilitatorView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// The sessions a peer mentor led or co-led and how everyone who attended rated them.
export function FacilitatorScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: FacilitatorScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader title="Facilitator view" />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your sessions" />
      ) : data.sessions.length === 0 ? (
        <Card>
          <EmptyState icon="chart" title="No sessions yet" />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            <StatTile label="Sessions completed" value={data.completed} />
            <StatTile label="In progress" value={data.inProgress} />
            <StatTile label="Your average rating" value={data.average?.toFixed(1) ?? null} />
            <StatTile label="All peer mentors" value={null} emptyLabel={NOT_AVAILABLE} />
          </div>

          <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
            <div className="flex min-w-0 flex-col gap-4 md:gap-5 lg:col-span-2">
              {data.best && data.best.rating !== null && (
                <Card>
                  <div className="flex flex-col gap-0.5">
                    <p className="font-sans text-small text-text-secondary">Best-rated session</p>
                    <Link
                      href={sessionRatingsRoute(data.best.id)}
                      className="inline-flex min-h-control items-center self-start font-mono text-card-title font-semibold text-link"
                    >
                      {data.best.title}
                    </Link>
                    <p className="font-sans text-small text-text-secondary">
                      {data.best.rating.toFixed(1)}, {formatDay(data.best.startsAt)}
                    </p>
                  </div>
                </Card>
              )}
              <Card title="Your ratings over time">
                <div className="flex flex-col gap-3">
                  <RatingTrendChart points={data.trend} />
                  <p className="font-sans text-caption text-text-muted">
                    Comparing with all peer mentors is not available yet.
                  </p>
                </div>
              </Card>
            </div>

            <Card title="Sessions you mentored" flush>
              <ul className="px-4 md:px-6">
                {data.sessions.map((row) => (
                  <li key={row.id} className="border-b border-border last:border-b-0">
                    <Link
                      href={sessionRatingsRoute(row.id)}
                      className="flex min-h-control items-center justify-between gap-3 py-3 text-inherit no-underline hover:no-underline"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="font-sans text-small font-semibold text-link">
                          {row.title}
                        </span>
                        <span className="font-sans text-caption text-text-secondary">
                          {formatDay(row.startsAt)}
                        </span>
                      </span>
                      {row.isInProgress ? (
                        <Chip variant="warn">In progress</Chip>
                      ) : (
                        <span className="shrink-0 font-mono text-small font-semibold text-text-primary">
                          {row.rating === null ? 'No ratings' : row.rating.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
