'use client'

import { useState } from 'react'
import { AttendanceStateChip } from '@/components/forge/AttendanceStateChip'
import { MenteeNumbers } from '@/components/forge/MenteeNumbers'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { formatDay } from '@/lib/format'
import { PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'
import type { MenteeDetailView } from '@/types/peerMentor'

const SHORT_LIST = 4
const NOT_AVAILABLE = 'Not available yet'

interface MenteeDetailScreenProps {
  // null until the data loads
  detail: MenteeDetailView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const rowClasses =
  'flex items-center justify-between gap-3 border-b border-border py-2.5 font-sans text-small text-text-primary last:border-b-0'

function Muted({ children }: { children: string }) {
  return <p className="font-sans text-small text-text-muted">{children}</p>
}

// One mentee, read only. Nothing here can change their data, and their contact details
// aren't shown. This only draws the screen; the page's hook loads the data.
export function MenteeDetailScreen({
  detail,
  isLoading = false,
  error = null,
  onRetry,
}: MenteeDetailScreenProps) {
  const [showAll, setShowAll] = useState(false)
  const attendance = detail?.attendance ?? []
  const shown = showAll ? attendance : attendance.slice(0, SHORT_LIST)

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={PEER_MENTOR_ROUTES.home}>Back to my mentees</BackLink>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !detail ? (
        <LoadingState label="Loading this mentee" />
      ) : (
        <>
          <PageHeader
            title={detail.card.name}
            subtitle={<span className="text-text-muted">University not available yet</span>}
            action={<Chip>View only</Chip>}
            keepActionBeside
          />
          <Card>
            <MenteeNumbers mentee={detail.card} />
          </Card>
          <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
            <Card title="Attendance">
              {attendance.length === 0 ? (
                <Muted>No sessions to show yet.</Muted>
              ) : (
                <>
                  <ul>
                    {shown.map((row) => (
                      <li key={row.sessionId} className={rowClasses}>
                        <span className="min-w-0">
                          {row.title}, {formatDay(row.startsAt)}
                        </span>
                        <AttendanceStateChip state={row.state} />
                      </li>
                    ))}
                  </ul>
                  {attendance.length > SHORT_LIST && !showAll && (
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="inline-flex min-h-control items-center font-sans text-caption font-semibold text-link hover:underline"
                    >
                      See all sessions
                    </button>
                  )}
                </>
              )}
            </Card>
            <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
              <Card title="Objectives">
                {detail.objectives === null ? (
                  <Muted>{NOT_AVAILABLE}</Muted>
                ) : detail.objectives.length === 0 ? (
                  <Muted>No objectives to show yet.</Muted>
                ) : (
                  <ul>
                    {detail.objectives.map((objective) => (
                      <li key={objective.skill} className={rowClasses}>
                        <span>{objective.label}</span>
                        <span className="text-text-secondary">{objective.summary}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card title="Extra activities">
                <ul>
                  {detail.activities.map((activity) => (
                    <li key={activity.label} className={rowClasses}>
                      <span>{activity.label}</span>
                      <span className="font-mono font-semibold tabular-nums">{activity.count}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Ratings and feedback">
                {detail.feedback === null ? (
                  <Muted>{NOT_AVAILABLE}</Muted>
                ) : detail.feedback.length === 0 ? (
                  <Muted>No ratings or feedback yet.</Muted>
                ) : (
                  <ul>
                    {detail.feedback.map((row) => (
                      <li
                        key={row.sessionId}
                        className="flex flex-col gap-1 border-b border-border py-2.5 font-sans text-small text-text-primary last:border-b-0"
                      >
                        <span className="font-semibold">{row.title}</span>
                        {row.ratings.length > 0 && (
                          <span className="text-text-secondary">
                            {row.ratings
                              .map((rating) => `${rating.label} ${rating.value}`)
                              .join(', ')}
                          </span>
                        )}
                        {row.feedback && <span>{row.feedback}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
