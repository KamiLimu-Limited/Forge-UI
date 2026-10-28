'use client'

import { useState } from 'react'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useOverrideQueue, type OverrideQueueItem } from '@/hooks/useOverrideQueue'
import { useToast } from '@/hooks/useToast'
import {
  formatDateTime,
  formatDay,
  formatTime,
  fromDateTimeLocal,
  toDateTimeLocal,
} from '@/lib/format'
import { ATTENDANCE_STATUS_LABELS, OVERRIDE_STATUS_LABELS } from '@/lib/labels'
import type { OverrideRequestStatus } from '@/types/attendance'

const STATUSES: OverrideRequestStatus[] = ['pending', 'approved', 'denied']

// Two days from now, as a starting point for a new deadline
function defaultDeadline(): string {
  return toDateTimeLocal(new Date(Date.now() + 48 * 60 * 60 * 1000))
}

type Decision = { kind: 'approve' | 'deny'; requestId: string } | null

interface RequestRowProps {
  item: OverrideQueueItem
  decision: Decision
  onDecide: (decision: Decision) => void
  isReviewing: boolean
  reviewError: string | null
  onApprove: (newClosesAt: string, reason: string) => void
  onDeny: (reason: string) => void
}

function RequestRow({
  item,
  decision,
  onDecide,
  isReviewing,
  reviewError,
  onApprove,
  onDeny,
}: RequestRowProps) {
  const { request, menteeName } = item
  const firstName = menteeName.split(' ')[0]
  const [deadline, setDeadline] = useState(defaultDeadline)
  const [reason, setReason] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const isOpen = decision?.requestId === request.id
  const isPending = request.status === 'pending'

  const submit = () => {
    if (decision?.kind === 'approve') {
      const iso = fromDateTimeLocal(deadline)
      if (!iso || new Date(iso) <= new Date()) {
        setFieldError('Choose a deadline in the future.')
        return
      }
      onApprove(iso, reason.trim())
    } else {
      if (!reason.trim()) {
        setFieldError(`Write the reason ${firstName} will see.`)
        return
      }
      onDeny(reason.trim())
    }
  }

  return (
    <li className="grid grid-cols-1 gap-3 border-t border-border py-5 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-12 lg:gap-5">
      <div className="lg:col-span-2">
        <p className="font-sans text-body font-semibold text-text-primary">{menteeName}</p>
        <p className="font-sans text-caption text-text-muted">
          Submitted {formatDateTime(request.created_at)}
        </p>
      </div>
      <div className="lg:col-span-3">
        <p className="font-sans text-body font-semibold text-text-primary">
          {request.session.title}
        </p>
        <p className="font-sans text-caption text-text-muted">
          {formatDay(request.session.starts_at)}, {formatTime(request.session.starts_at)}
        </p>
        {item.currentStatus && (
          <p className="font-sans text-caption text-text-muted">
            Current record: {ATTENDANCE_STATUS_LABELS[item.currentStatus]}
          </p>
        )}
      </div>
      <div className="font-sans text-body text-text-secondary lg:col-span-5">
        &ldquo;{request.reason}&rdquo;
        {!isPending && (
          <p className="mt-2 font-sans text-caption text-text-muted">
            {OVERRIDE_STATUS_LABELS[request.status]}
            {request.reviewed_at ? ` ${formatDateTime(request.reviewed_at)}` : ''}
            {request.review_reason ? `. ${request.review_reason}` : ''}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 lg:col-span-2 lg:justify-end">
        {isPending ? (
          <>
            <Button
              size="sm"
              onClick={() => {
                setFieldError(null)
                setReason('')
                onDecide({ kind: 'approve', requestId: request.id })
              }}
              aria-label={`Approve ${menteeName}'s request`}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                setFieldError(null)
                setReason('')
                onDecide({ kind: 'deny', requestId: request.id })
              }}
              aria-label={`Deny ${menteeName}'s request`}
            >
              Deny
            </Button>
          </>
        ) : (
          <Chip variant={request.status === 'approved' ? 'ok' : 'err'}>
            {OVERRIDE_STATUS_LABELS[request.status]}
          </Chip>
        )}
      </div>
      {isOpen && decision && (
        <div className="flex flex-col gap-3 rounded-control border border-border bg-background p-4 lg:col-span-10 lg:col-start-3 md:flex-row md:flex-wrap md:items-end">
          <div className="flex-1 md:min-w-64">
            {decision.kind === 'approve' ? (
              <Input
                label={`New deadline for ${menteeName}`}
                type="datetime-local"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value)
                  setFieldError(null)
                }}
                error={fieldError ?? reviewError ?? undefined}
              />
            ) : (
              <Input
                label={`Reason for denying (${firstName} will see this)`}
                placeholder={`Write the reason ${firstName} will see`}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  setFieldError(null)
                }}
                error={fieldError ?? reviewError ?? undefined}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={decision.kind === 'approve' ? 'primary' : 'danger'}
              onClick={submit}
              isLoading={isReviewing}
            >
              {decision.kind === 'approve' ? 'Approve and reopen' : 'Deny request'}
            </Button>
            <Button variant="secondary" onClick={() => onDecide(null)} disabled={isReviewing}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </li>
  )
}

export function OverrideQueuePage() {
  const { showToast } = useToast()
  const { cohortId, isLoading: cohortLoading } = useActiveCohort()
  const [status, setStatus] = useState<OverrideRequestStatus>('pending')
  const [decision, setDecision] = useState<Decision>(null)
  const queue = useOverrideQueue(cohortId, status)

  const decide = (next: Decision) => {
    queue.clearReviewError()
    setDecision(next)
  }

  if (!cohortLoading && !cohortId) {
    return (
      <>
        <PageHeader title="Attendance queue" />
        <NoCohortNotice />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Attendance queue"
        subtitle="Requests to reopen a closed attendance window, oldest first."
        action={
          <div className="flex flex-wrap gap-2" role="group" aria-label="Request status">
            {STATUSES.map((s) => (
              <Chip
                key={s}
                variant={status === s ? 'on' : 'default'}
                pressed={status === s}
                onClick={() => {
                  setStatus(s)
                  setDecision(null)
                }}
              >
                {OVERRIDE_STATUS_LABELS[s]}
                {s === 'pending' && queue.pendingCount !== null ? ` (${queue.pendingCount})` : ''}
              </Chip>
            ))}
          </div>
        }
      />
      <Card>
        {queue.isLoading ? (
          <LoadingState label="Loading requests" />
        ) : queue.error ? (
          <ErrorState message={queue.error} onRetry={queue.refetch} />
        ) : queue.items.length === 0 ? (
          <EmptyState
            icon="check"
            title={
              status === 'pending'
                ? 'Nothing waiting'
                : `No ${OVERRIDE_STATUS_LABELS[status].toLowerCase()} requests`
            }
            description={
              status === 'pending'
                ? 'When a mentee asks to reopen a closed window, the request shows up here.'
                : undefined
            }
          />
        ) : (
          <ul className="flex flex-col">
            {queue.items.map((item) => (
              <RequestRow
                key={item.request.id}
                item={item}
                decision={decision}
                onDecide={decide}
                isReviewing={queue.isReviewing}
                reviewError={decision?.requestId === item.request.id ? queue.reviewError : null}
                onApprove={(newClosesAt, reason) =>
                  void queue.approve(item.request.id, newClosesAt, reason).then((ok) => {
                    if (!ok) return
                    setDecision(null)
                    showToast(
                      `Approved. ${item.menteeName} can submit until ${formatDateTime(newClosesAt)}.`
                    )
                  })
                }
                onDeny={(reason) =>
                  void queue.deny(item.request.id, reason).then((ok) => {
                    if (!ok) return
                    setDecision(null)
                    showToast(`Denied. ${item.menteeName} will see your reason.`)
                  })
                }
              />
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
