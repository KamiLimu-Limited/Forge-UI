'use client'

import { ATTENDANCE_STATUS_LABELS } from '@/lib/labels'
import type { FormEvent } from 'react'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { RatingScale } from '@/components/ui/RatingScale'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Textarea } from '@/components/ui/Textarea'
import { useAttendanceAnswers } from '@/hooks/useAttendanceAnswers'
import { formatDay, formatTimeRange, plural } from '@/lib/format'
import { MENTEE_ROUTES, menteeExtensionRoute } from '@/lib/menteeRoutes'
import type { AttendanceAnswers, SessionRecordView } from '@/types/menteeSessions'

interface AttendanceScreenProps {
  // null until the data loads
  session: SessionRecordView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onSubmit: (answers: AttendanceAnswers) => void
  isSubmitting?: boolean
  submitError?: string | null
}

const STATUS_OPTIONS: { value: AttendanceAnswers['status']; label: string }[] = [
  { value: 'present', label: ATTENDANCE_STATUS_LABELS.present },
  { value: 'absent', label: ATTENDANCE_STATUS_LABELS.absent },
]

// Shown instead of the form. A submission is final for mentees; the System Admin corrects it.
function FormUnavailable({ session }: { session: SessionRecordView }) {
  const hasSubmitted = session.recordState !== null && session.recordState !== 'pending'
  if (hasSubmitted) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Notice className="w-full">You&apos;ve submitted your attendance for this session.</Notice>
        <ButtonLink href={MENTEE_ROUTES.sessionHistory} variant="secondary">
          View in history
        </ButtonLink>
      </div>
    )
  }
  if (session.windowState === 'upcoming') return <Notice>{session.opensLabel}</Notice>
  return (
    <div className="flex flex-col items-start gap-3">
      <Notice className="w-full">The attendance window for this session has closed.</Notice>
      <ButtonLink href={menteeExtensionRoute(session.id)} variant="secondary">
        Request extension
      </ButtonLink>
    </div>
  )
}

function AttendanceForm({
  session,
  onSubmit,
  isSubmitting,
  submitError,
}: {
  session: SessionRecordView
  onSubmit: (answers: AttendanceAnswers) => void
  isSubmitting: boolean
  submitError: string | null
}) {
  const form = useAttendanceAnswers(
    session.ratingGroups.flatMap((group) => group.questions.map((question) => question.number))
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const ready = form.check()
    if (ready) onSubmit(ready)
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid items-start gap-4 lg:grid-cols-3 lg:gap-5"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:col-span-2 lg:gap-5">
        <Card title="Were you there?">
          <div className="max-w-sm">
            <SegmentedControl
              label="Attendance"
              options={STATUS_OPTIONS}
              value={form.answers.status}
              onChange={form.setStatus}
              variant="joined"
            />
          </div>
          {form.showErrors && !form.hasStatus && (
            <p role="alert" className="mt-2 font-sans text-caption text-danger-text">
              Choose Present or Absent
            </p>
          )}
        </Card>

        {form.isPresent &&
          session.ratingGroups.map((group, index) => (
            <Card key={group.title} title={group.title}>
              {index === 0 && (
                <p className="mb-3 font-sans text-caption text-text-muted">
                  Rate from 1 (lowest) to 5 (highest).
                </p>
              )}
              {group.questions.map((question) => (
                <RatingScale
                  key={question.number}
                  question={question.text}
                  value={form.answers.ratings[question.number]}
                  onChange={(value) => form.setRating(question.number, value)}
                  error={
                    form.showErrors && form.answers.ratings[question.number] === undefined
                      ? 'Choose a rating'
                      : undefined
                  }
                />
              ))}
            </Card>
          ))}

        <Card title="Your feedback">
          <Textarea
            aria-label="Your feedback"
            placeholder="What worked, and what could be better?"
            value={form.answers.feedback}
            onChange={(event) => form.setFeedback(event.target.value)}
            error={form.showErrors && !form.isFeedbackWritten ? 'Write your feedback' : undefined}
          />
        </Card>
      </div>

      <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-6 lg:gap-5">
        <Card title="Before you submit">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-small text-text-secondary">
              You earn this session&apos;s {plural(session.points, 'point')} only when you&apos;re
              Present and every rating and the feedback are filled in.
            </p>
            {form.isPresent && (
              <p className="font-sans text-small text-text-primary">
                <strong className="font-semibold">
                  {form.ratedCount} of {form.totalRatings}
                </strong>{' '}
                ratings done.{' '}
                {form.isFeedbackWritten ? 'Feedback written.' : 'Feedback not written yet.'}
              </p>
            )}
            {submitError && <Notice variant="danger">{submitError}</Notice>}
            <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
              Submit attendance
            </Button>
          </div>
        </Card>
        {(session.leaderName ?? session.materialsUrl) && (
          <div className="hidden lg:block">
            <Card title="Session">
              <div className="flex flex-col gap-2 font-sans text-small text-text-secondary">
                {session.leaderName && <p>With {session.leaderName}</p>}
                {session.materialsUrl && (
                  <a
                    href={session.materialsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-control items-center self-start font-semibold text-link hover:underline"
                  >
                    Open materials
                  </a>
                )}
              </div>
            </Card>
          </div>
        )}
      </aside>
    </form>
  )
}

function canSubmit(session: SessionRecordView): boolean {
  const isUnsubmitted = session.recordState === null || session.recordState === 'pending'
  return session.windowState === 'open' && isUnsubmitted
}

export function AttendanceScreen({
  session,
  isLoading = false,
  error = null,
  onRetry,
  onSubmit,
  isSubmitting = false,
  submitError = null,
}: AttendanceScreenProps) {
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
            {(session.pillar ?? session.closesInLabel) && (
              <div className="flex flex-wrap items-center gap-2">
                {session.pillar && <TrackBadge pillar={session.pillar} />}
                {canSubmit(session) && session.closesInLabel && (
                  <Chip variant="warn">{session.closesInLabel}</Chip>
                )}
              </div>
            )}
            <PageHeader
              title={session.title}
              subtitle={`${formatDay(session.startsAt)}, ${formatTimeRange(session.startsAt, session.endsAt)}.${
                session.windowClosesLabel ? ` Window closes ${session.windowClosesLabel}.` : ''
              }`}
            />
          </div>
          {canSubmit(session) ? (
            <AttendanceForm
              session={session}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          ) : (
            <FormUnavailable session={session} />
          )}
        </>
      )}
    </div>
  )
}
