'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SessionForm } from '@/components/forge/SessionForm'
import { StatusChip } from '@/components/forge/StatusChip'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DangerZone } from '@/components/ui/DangerZone'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useMentorOptions } from '@/hooks/useMentorOptions'
import { useSessionDetail } from '@/hooks/useSessionDetail'
import { useSessionEditor } from '@/hooks/useSessionEditor'
import { useToast } from '@/hooks/useToast'
import { formatDateTime, formatDay, formatTimeRange } from '@/lib/format'
import type { SessionDetailResponse, SessionStatus } from '@/types/session'

const STATUS_NOTES: Record<SessionStatus, string> = {
  draft: 'Only admins can see this session until you publish it.',
  published: 'Visible to participants',
  completed: 'This session has finished.',
  cancelled: "Cancelled. It no longer counts towards anyone's attendance.",
}

const SUBTITLES: Record<SessionStatus, string> = {
  draft: 'Draft. Publishing notifies everyone in the cohort.',
  published:
    'Published. Changes to the date or time notify everyone enrolled and the assigned mentors.',
  completed: 'Completed.',
  cancelled: 'Cancelled. This session can no longer be edited.',
}

interface StatusCardProps {
  session: SessionDetailResponse
}

function StatusCard({ session }: StatusCardProps) {
  const history = session.reschedule_history ?? []
  return (
    <Card title="Status">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusChip kind="session" status={session.status} />
          <span className="font-sans text-small text-text-muted">
            {STATUS_NOTES[session.status]}
          </span>
        </div>
        {session.attendance_window && (
          <p className="font-sans text-small text-text-secondary">
            Attendance window {session.attendance_window.is_active ? 'closes' : 'closed'}{' '}
            {formatDateTime(session.attendance_window.closes_at)}.
          </p>
        )}
        {history.length === 0 ? (
          <p className="font-sans text-small text-text-secondary">Reschedule history: none</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="font-sans text-small font-semibold text-text-primary">
              Reschedule history
            </p>
            <ul className="flex flex-col gap-2">
              {history.map((entry) => (
                <li key={entry.at} className="font-sans text-small text-text-secondary">
                  Moved from {formatDateTime(entry.from)} to {formatDateTime(entry.to)}
                  {entry.reason ? `. ${entry.reason}` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

interface EditSessionPageProps {
  sessionId: string
}

export function EditSessionPage({ sessionId }: EditSessionPageProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const { cohorts } = useActiveCohort()
  const detail = useSessionDetail(sessionId)
  const session = detail.session
  const cohort = cohorts.find((c) => c.id === session?.cohort_id) ?? null
  const editor = useSessionEditor({ cohort, session })
  const mentors = useMentorOptions(session?.cohort_id ?? null)
  const [isCancelOpen, setIsCancelOpen] = useState(false)

  const isCancelled = session?.status === 'cancelled'

  const submit = async (publish: boolean) => {
    const result = await editor.save(publish)
    if (!result.ok) return
    showToast(result.message, result.session ? 'success' : 'info')
    if (result.session) detail.refetch()
  }

  const confirmCancel = async (reason: string) => {
    if (await detail.cancel(reason)) {
      setIsCancelOpen(false)
      showToast('Session cancelled. Everyone enrolled and the mentors have been emailed.')
      router.push('/admin/sessions')
    }
  }

  if (detail.isLoading && !session) {
    return (
      <>
        <BackLink href="/admin/sessions">Back to the calendar</BackLink>
        <LoadingState label="Loading session" />
      </>
    )
  }

  if (detail.error || !session) {
    return (
      <>
        <BackLink href="/admin/sessions">Back to the calendar</BackLink>
        <ErrorState
          message={detail.error ?? "We couldn't find this session."}
          onRetry={detail.refetch}
        />
      </>
    )
  }

  return (
    <>
      <BackLink href="/admin/sessions">Back to the calendar</BackLink>
      <PageHeader
        title="Edit session"
        subtitle={SUBTITLES[session.status]}
        action={
          <div className="flex flex-wrap gap-3">
            <ButtonLink variant="secondary" href={`/admin/sessions/${session.id}/attendance`}>
              View attendance
            </ButtonLink>
            {!isCancelled && session.status === 'draft' && (
              <Button
                variant="secondary"
                onClick={() => void submit(true)}
                disabled={editor.isSaving}
              >
                Publish
              </Button>
            )}
            {!isCancelled && (
              <Button
                onClick={() => void submit(false)}
                isLoading={editor.isSaving}
                disabled={!editor.isDirty}
              >
                Save changes
              </Button>
            )}
          </div>
        }
      />

      {isCancelled && (
        <Notice variant="warning">
          {session.title} on {formatDay(session.starts_at)} was cancelled. It stays here for the
          record.
        </Notice>
      )}
      {editor.saveError && <Notice variant="danger">{editor.saveError}</Notice>}

      <SessionForm
        values={editor.values}
        errors={editor.errors}
        onChange={editor.setValue}
        cohort={cohort}
        mentors={mentors.mentors}
        mentorsLoading={mentors.isLoading}
        mentorsError={mentors.error}
        isEdit
        timeChanged={editor.timeChanged}
        disabled={editor.isSaving || isCancelled}
        aside={
          <>
            <StatusCard session={session} />
            {!isCancelled && (
              <DangerZone
                title="Cancel this session"
                description="Cancelled sessions don't count towards anyone's attendance rate. Everyone enrolled and the assigned mentors are emailed."
                action={
                  <Button variant="danger" onClick={() => setIsCancelOpen(true)}>
                    Cancel session
                  </Button>
                }
              />
            )}
          </>
        }
      />

      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => {
          setIsCancelOpen(false)
          detail.clearCancelError()
        }}
        title="Cancel this session?"
        confirmLabel="Cancel session"
        cancelLabel="Keep session"
        variant="danger"
        reason={{
          label: 'Reason',
          placeholder: 'For example, the facilitator is unavailable',
          required: true,
        }}
        isLoading={detail.isCancelling}
        error={detail.cancelError}
        onConfirm={(reason) => void confirmCancel(reason)}
      >
        <p>
          <span className="font-semibold text-text-primary">{session.title}</span>,{' '}
          {formatDay(session.starts_at)}, {formatTimeRange(session.starts_at, session.ends_at)}.
        </p>
        <p className="text-small">
          It will be removed from everyone&apos;s calendar and won&apos;t count towards attendance
          rates. Everyone enrolled and the assigned mentors get an email with your reason.
        </p>
      </ConfirmDialog>
    </>
  )
}
