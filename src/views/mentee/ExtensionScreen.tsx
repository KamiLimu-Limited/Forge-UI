import type { FormEvent } from 'react'
import { ExtensionRequestCard } from '@/components/forge/ExtensionRequestCard'
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
import { Textarea } from '@/components/ui/Textarea'
import { formatDay, formatTimeRange } from '@/lib/format'
import { MENTEE_ROUTES, menteeAttendanceRoute } from '@/lib/menteeRoutes'
import type { ExtensionView } from '@/types/menteeSessions'

interface ExtensionScreenProps {
  // null until the data loads
  data: ExtensionView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  reason: string
  onReasonChange: (reason: string) => void
  reasonError?: string | null
  onSend: () => void
  isSending?: boolean
  sendError?: string | null
}

// A mentee who missed a window asks for it to be reopened. The form shows when there is
// nothing pending; a denied mentee can ask again, and the server has the final say.
export function ExtensionScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  reason,
  onReasonChange,
  reasonError = null,
  onSend,
  isSending = false,
  sendError = null,
}: ExtensionScreenProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSend()
  }

  const session = data?.session
  const request = data?.request ?? null
  const hasSubmitted = session?.recordState && session.recordState !== 'pending'
  const isClosed = session?.windowState === 'closed'
  const canRequest = isClosed && !hasSubmitted && (!request || request.status === 'denied')

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
            <div className="flex flex-wrap items-center gap-2">
              {session.pillar && <TrackBadge pillar={session.pillar} />}
              {isClosed && <Chip>Window closed</Chip>}
            </div>
            <PageHeader
              title={session.title}
              subtitle={`${formatDay(session.startsAt)}, ${formatTimeRange(session.startsAt, session.endsAt)}.${
                isClosed && session.windowClosesLabel
                  ? ` The attendance window closed ${session.windowClosesLabel}.`
                  : ''
              }`}
            />
          </div>

          {hasSubmitted && (
            <Notice>You&apos;ve submitted your attendance, so no extension is needed.</Notice>
          )}
          {session.windowState === 'upcoming' && <Notice>{session.opensLabel}</Notice>}
          {session.windowState === 'open' && !hasSubmitted && !request && (
            <div className="flex flex-col items-start gap-3">
              <Notice className="w-full">
                The attendance window is still open, so you don&apos;t need an extension.
              </Notice>
              <ButtonLink href={menteeAttendanceRoute(session.id)}>Attend</ButtonLink>
            </div>
          )}

          <div className="grid items-start gap-4 lg:grid-cols-5 lg:gap-5">
            {canRequest && (
              <form onSubmit={handleSubmit} noValidate className="min-w-0 lg:col-span-3">
                <Card title="Request an extension">
                  <div className="flex flex-col gap-3">
                    <p className="font-sans text-small text-text-secondary">
                      Tell the System Admin why you couldn&apos;t submit in time. If they approve,
                      the window reopens for you only.
                    </p>
                    <Textarea
                      label="Reason"
                      value={reason}
                      onChange={(event) => onReasonChange(event.target.value)}
                      error={reasonError ?? undefined}
                    />
                    {sendError && <Notice variant="danger">{sendError}</Notice>}
                    <Button
                      type="submit"
                      size="lg"
                      fullWidth
                      isLoading={isSending}
                      className="md:w-auto md:self-start"
                    >
                      Send request
                    </Button>
                  </div>
                </Card>
              </form>
            )}
            {request && !hasSubmitted && (
              <div className="min-w-0 lg:col-span-2">
                <ExtensionRequestCard session={session} request={request} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
