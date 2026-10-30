import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { formatRelativeDateTime } from '@/lib/format'
import { menteeAttendanceRoute } from '@/lib/menteeRoutes'
import type { ExtensionRequestView, SessionRecordView } from '@/types/menteeSessions'
import { StatusChip } from './StatusChip'

interface ExtensionRequestCardProps {
  session: SessionRecordView
  request: ExtensionRequestView
}

// Where the mentee's window extension request stands
export function ExtensionRequestCard({ session, request }: ExtensionRequestCardProps) {
  const canAttend = request.status === 'approved' && session.windowState === 'open'
  return (
    <Card title="Your request" action={<StatusChip kind="override" status={request.status} />}>
      <div className="flex flex-col gap-3 font-sans text-small text-text-secondary">
        <p>Sent {formatRelativeDateTime(request.sentAt)}.</p>
        {request.status === 'pending' && (
          <p>You&apos;ll get an email when the System Admin decides.</p>
        )}
        {request.status === 'denied' && request.reviewReason && (
          <p>
            <strong className="font-semibold text-text-primary">Reason:</strong>{' '}
            {request.reviewReason}
          </p>
        )}
        {canAttend && (
          <>
            <p>Submit by {session.windowClosesLabel}. Your record will show Present, reopened.</p>
            <ButtonLink href={menteeAttendanceRoute(session.id)} fullWidth className="md:w-auto">
              Attend now
            </ButtonLink>
          </>
        )}
        {request.status === 'approved' && !canAttend && <p>The new deadline has passed.</p>}
      </div>
    </Card>
  )
}
