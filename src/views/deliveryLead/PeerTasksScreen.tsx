import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Notice } from '@/components/ui/Notice'
import { TextLink } from '@/components/ui/TextLink'
import { DELIVERY_LEAD_ROUTES, editTaskRoute } from '@/lib/committeeRoutes'
import { formatDay } from '@/lib/format'
import type { PeerTaskRow, PeerTasksView, TaskState } from '@/types/peerTasks'
import { NoCohortCard } from '@/views/committee/CommitteeStates'

interface PeerTasksScreenProps {
  // null until the data loads
  data: PeerTasksView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  // Where "See the group meetings" goes in this shell
  groupMeetingsHref: string
}

const STATE_CHIPS: Record<
  TaskState,
  { label: string; variant: 'default' | 'ok' | 'info' | 'draft' }
> = {
  completed: { label: 'Completed', variant: 'default' },
  open: { label: 'Open', variant: 'ok' },
  published: { label: 'Published', variant: 'info' },
  draft: { label: 'Draft', variant: 'draft' },
}

const COLUMNS: DataTableColumn<PeerTaskRow>[] = [
  {
    key: 'task',
    header: 'Task',
    render: (row) => <span className="font-semibold">{row.title}</span>,
  },
  { key: 'opens', header: 'Opens', render: (row) => formatDay(row.opensAt) },
  { key: 'due', header: 'Due', render: (row) => formatDay(row.dueAt) },
  { key: 'points', header: 'Points', num: true, render: (row) => row.points },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Chip variant={STATE_CHIPS[row.state].variant}>{STATE_CHIPS[row.state].label}</Chip>
    ),
  },
  {
    key: 'edit',
    header: 'Edit',
    alignEnd: true,
    render: (row) => <TextLink href={editTaskRoute(row.id)}>Edit</TextLink>,
  },
]

// The cohort's peer mentorship tasks (COM-Tasks).
export function PeerTasksScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
  groupMeetingsHref,
}: PeerTasksScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Peer mentorship tasks"
        subtitle={
          data?.cohortName
            ? `${data.cohortName}. Each task shows on the cohort calendar as two all-day entries: when it opens and when it's due.`
            : undefined
        }
        action={<ButtonLink href={DELIVERY_LEAD_ROUTES.newTask}>New task</ButtonLink>}
      />
      {!hasCohort ? (
        <NoCohortCard />
      ) : (
        <Card flush>
          <DataTable
            label="Peer mentorship tasks"
            columns={COLUMNS}
            rows={data?.tasks ?? []}
            rowKey={(row) => row.id}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
            empty={{
              icon: 'calendar',
              title: 'No tasks yet',
              action: <ButtonLink href={DELIVERY_LEAD_ROUTES.newTask}>New task</ButtonLink>,
            }}
          />
        </Card>
      )}
      <Notice>
        Within each task&apos;s window, every 1:1 group picks its own meeting time, physically or
        virtually.{' '}
        <TextLink href={groupMeetingsHref} layout="inline">
          See the group meetings
        </TextLink>
      </Notice>
    </div>
  )
}
