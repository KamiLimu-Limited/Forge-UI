import type { FormEvent } from 'react'
import { AttendanceStateChip } from '@/components/forge/AttendanceStateChip'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { Textarea } from '@/components/ui/Textarea'
import { formatDay, formatRelativeDateTime, formatTimeRange } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { SessionRecordView } from '@/types/menteeSessions'

interface NotesScreenProps {
  // null until the data loads
  session: SessionRecordView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  notes: string
  onNotesChange: (notes: string) => void
  onSave: () => void
  isSaving?: boolean
  saveError?: string | null
  savedAt?: string | null
  // Shown at the top while saving is switched off, for example for peer mentors
  saveBlockedNote?: string | null
}

// A mentee's private notes for one session. Notes need an attendance record and an open
// window, so the box is disabled otherwise.
export function NotesScreen({
  session,
  isLoading = false,
  error = null,
  onRetry,
  notes,
  onNotesChange,
  onSave,
  isSaving = false,
  saveError = null,
  savedAt = null,
  saveBlockedNote = null,
}: NotesScreenProps) {
  // The API only edits a record while its window is open. See docs/api-gaps.md.
  const canEdit = session?.recordId !== null && session?.windowState === 'open'

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave()
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={MENTEE_ROUTES.sessions}>Back to sessions</BackLink>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !session ? (
        <LoadingState label="Loading your notes" />
      ) : (
        <>
          <PageHeader title={session.title} />
          <div className="grid items-start gap-4 lg:grid-cols-3 lg:gap-5">
            <form onSubmit={handleSubmit} className="min-w-0 lg:col-span-2">
              <Card>
                <div className="flex flex-col gap-3">
                  {saveBlockedNote ? (
                    <Notice>{saveBlockedNote}</Notice>
                  ) : (
                    !canEdit && (
                      <Notice>
                        Not available yet.{' '}
                        {session.recordId
                          ? 'Notes can only be changed while the attendance window is open.'
                          : "You can add notes once you've submitted attendance for this session."}
                      </Notice>
                    )
                  )}
                  <Textarea
                    label="Your notes"
                    hint="Only you can see your notes."
                    placeholder="Write anything you want to remember from this session"
                    rows={12}
                    value={notes}
                    disabled={!canEdit || Boolean(saveBlockedNote)}
                    onChange={(event) => onNotesChange(event.target.value)}
                  />
                  {saveError && <Notice variant="danger">{saveError}</Notice>}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-sans text-caption text-text-muted">
                      {savedAt ? `Last saved ${formatRelativeDateTime(savedAt)}` : ''}
                    </span>
                    <Button
                      type="submit"
                      isLoading={isSaving}
                      disabled={!canEdit || Boolean(saveBlockedNote)}
                    >
                      Save notes
                    </Button>
                  </div>
                </div>
              </Card>
            </form>
            <Card title="Session">
              <dl className="flex flex-col gap-2 font-sans text-small">
                <div className="flex justify-between gap-3">
                  <dt className="text-text-secondary">Date</dt>
                  <dd>{formatDay(session.startsAt)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-secondary">Time</dt>
                  <dd className="text-right">
                    {formatTimeRange(session.startsAt, session.endsAt)}
                  </dd>
                </div>
                {session.pillar && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-secondary">Track</dt>
                    <dd>
                      <TrackBadge pillar={session.pillar} />
                    </dd>
                  </div>
                )}
                {session.recordState && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-secondary">You</dt>
                    <dd>
                      <AttendanceStateChip state={session.recordState} />
                    </dd>
                  </div>
                )}
              </dl>
              {session.materialsUrl && (
                <a
                  href={session.materialsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex min-h-control items-center font-sans text-caption font-semibold text-link hover:underline"
                >
                  Open session materials
                </a>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
