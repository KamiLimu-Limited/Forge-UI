'use client'

import { useState } from 'react'
import { RatingBar } from '@/components/forge/RatingBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Select } from '@/components/ui/Select'
import { formatDay, formatDayMonth, plural } from '@/lib/format'
import type { ProFeedbackView, ProSessionRow } from '@/types/proMentor'

interface ProFeedbackScreenProps {
  // Past sessions to pick from; null until they load
  sessions: ProSessionRow[] | null
  selectedId: string | null
  onSelect: (sessionId: string) => void
  feedback: ProFeedbackView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const FIRST_SHOWN = 4

// One past session's feedback: the average per question and what attendees wrote, with
// numbered participants and never names.
export function ProFeedbackScreen({
  sessions,
  selectedId,
  onSelect,
  feedback,
  isLoading = false,
  error = null,
  onRetry,
}: ProFeedbackScreenProps) {
  const [showAll, setShowAll] = useState(false)
  const shown = feedback
    ? showAll
      ? feedback.feedback
      : feedback.feedback.slice(0, FIRST_SHOWN)
    : []
  const session = feedback?.session

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title={session?.title ?? 'Feedback'}
        subtitle={
          session
            ? `${formatDay(session.startsAt)}. ${session.attended} of ${session.eligible} attended. Feedback is anonymous.`
            : undefined
        }
        action={
          sessions && sessions.length > 1 && selectedId ? (
            <div className="w-full md:w-72">
              <Select
                label="Session"
                value={selectedId}
                onChange={(event) => {
                  setShowAll(false)
                  onSelect(event.target.value)
                }}
                options={sessions.map((row) => ({
                  value: row.id,
                  label: `${row.title}, ${formatDayMonth(row.startsAt)}`,
                }))}
              />
            </div>
          ) : undefined
        }
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !sessions ? (
        <LoadingState label="Loading feedback" />
      ) : sessions.length === 0 ? (
        <Card>
          <EmptyState icon="chart" title="No feedback yet" />
        </Card>
      ) : !feedback ? (
        <LoadingState label="Loading feedback" />
      ) : feedback.responses === 0 ? (
        <Card>
          <EmptyState
            icon="chart"
            title="No ratings yet"
            description="Nobody has rated this session."
          />
        </Card>
      ) : (
        <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-2">
          <Card
            title="Average per question"
            action={
              feedback.average === null ? undefined : (
                <span className="font-mono text-stat font-semibold text-text-primary">
                  {feedback.average.toFixed(1)}
                </span>
              )
            }
          >
            <div className="flex flex-col gap-5">
              {feedback.groups.map((group) => (
                <section key={group.label} className="flex flex-col gap-3">
                  <h3 className="font-sans text-small text-text-secondary">{group.label}</h3>
                  {group.questions.map((question) => (
                    <RatingBar
                      key={question.label}
                      label={question.label}
                      average={question.average}
                    />
                  ))}
                </section>
              ))}
            </div>
          </Card>
          <Card
            title="Written feedback"
            action={
              <span className="font-sans text-small text-text-muted">
                {plural(feedback.responses, 'response')}
              </span>
            }
          >
            {feedback.feedback.length === 0 ? (
              <p className="font-sans text-small text-text-muted">No written feedback</p>
            ) : (
              <div className="flex flex-col gap-3">
                <ul className="flex flex-col">
                  {shown.map((entry) => (
                    <li
                      key={entry.label}
                      className="flex flex-col gap-1 border-b border-border py-3 first:pt-0 last:border-b-0"
                    >
                      <span className="font-sans text-caption text-text-muted">{entry.label}</span>
                      <p className="font-sans text-body text-text-primary">{entry.text}</p>
                    </li>
                  ))}
                </ul>
                {feedback.feedback.length > FIRST_SHOWN && (
                  <Button variant="secondary" size="sm" onClick={() => setShowAll((all) => !all)}>
                    {showAll ? 'Show fewer' : `Show all ${feedback.feedback.length}`}
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
