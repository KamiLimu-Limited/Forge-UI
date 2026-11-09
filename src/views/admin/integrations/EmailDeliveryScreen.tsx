import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { StatTile } from '@/components/ui/StatTile'
import { TextLink } from '@/components/ui/TextLink'
import { formatRelativeDateTime } from '@/lib/format'
import { NOTIFICATION_TYPE_LABELS } from '@/lib/labels'
import type { FailedEmailRow, FailedEmailsView } from '@/types/adminIntegrations'
import type { NotificationType } from '@/types/notification'

const NOT_AVAILABLE = 'Not available yet'

interface EmailDeliveryScreenProps {
  // null until the data loads
  data: FailedEmailsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onPageChange: (page: number) => void
}

function typeLabel(type: string): string {
  return NOTIFICATION_TYPE_LABELS[type as NotificationType] ?? type
}

// A bad address can only be fixed on the person's record; anything else is worth a retry
function isAddressProblem(error: string | null): boolean {
  return /address|mailbox|recipient|exist/i.test(error ?? '')
}

const COLUMNS: DataTableColumn<FailedEmailRow>[] = [
  {
    key: 'to',
    header: 'To',
    render: (row) => (
      <span className="flex flex-col">
        <span className="font-semibold">{row.name ?? 'Unknown person'}</span>
        {row.email && <span className="text-caption text-text-muted">{row.email}</span>}
      </span>
    ),
  },
  { key: 'email', header: 'Email', render: (row) => typeLabel(row.type) },
  {
    key: 'error',
    header: 'Error',
    render: (row) => <span className="text-small">{row.error ?? 'No error recorded'}</span>,
  },
  { key: 'attempts', header: 'Attempts', num: true, render: (row) => row.attempts },
  { key: 'queued', header: 'Queued', render: (row) => formatRelativeDateTime(row.queuedAt) },
  {
    key: 'action',
    header: 'Action',
    alignEnd: true,
    render: (row) =>
      isAddressProblem(row.error) ? (
        <TextLink href={`/admin/users/${row.userId}`}>Fix address</TextLink>
      ) : (
        <Button size="sm" variant="secondary" disabled title={NOT_AVAILABLE}>
          Retry
        </Button>
      ),
  },
]

// Emails that failed after every retry (SA-FailedEmails). This only draws the screen.
export function EmailDeliveryScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  onPageChange,
}: EmailDeliveryScreenProps) {
  return (
    <>
      <PageHeader
        title="Email delivery"
        subtitle="Emails that couldn't be delivered after every retry."
        action={
          <div className="flex flex-col items-end gap-1">
            <Button variant="secondary" disabled>
              Retry all
            </Button>
            <span className="font-sans text-caption text-text-muted">{NOT_AVAILABLE}</span>
          </div>
        }
      />
      <section aria-label="Delivery" className="grid gap-4 md:grid-cols-3 md:gap-5">
        <StatTile label="Sent, last 30 days" value={null} emptyLabel={NOT_AVAILABLE} />
        <StatTile
          label="Failed"
          value={data ? data.total : null}
          isLoading={isLoading && !data}
          emptyLabel="No data yet"
        />
        <StatTile label="Waiting to send" value={null} emptyLabel={NOT_AVAILABLE} />
      </section>
      <Card flush>
        <DataTable
          label="Failed emails"
          columns={COLUMNS}
          rows={data?.rows ?? []}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          error={error}
          onRetry={onRetry}
          empty={{ icon: 'check', title: 'No failed emails' }}
          pagination={
            data
              ? {
                  page: data.page,
                  pageSize: data.pageSize,
                  total: data.total,
                  onPageChange,
                }
              : undefined
          }
        />
      </Card>
    </>
  )
}
