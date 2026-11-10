import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Select } from '@/components/ui/Select'
import { StatTile } from '@/components/ui/StatTile'
import { formatDateTime } from '@/lib/format'
import type { GroupMeetingRow, GroupMeetingsView } from '@/types/adminIntegrations'
import { NoCohortCard } from '@/views/committee/CommitteeStates'

const NOT_AVAILABLE = 'Not available yet'

interface GroupMeetingsScreenProps {
  // null until the data loads
  data: GroupMeetingsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  onTaskChange: (taskId: string) => void
}

const muted = <span className="text-small text-text-muted">{NOT_AVAILABLE}</span>

const COLUMNS: DataTableColumn<GroupMeetingRow>[] = [
  {
    key: 'mentor',
    header: 'Peer mentor',
    sortValue: (row) => row.peerMentorName,
    render: (row) => <span className="font-semibold">{row.peerMentorName}</span>,
  },
  {
    key: 'group',
    header: 'Group',
    render: (row) => (
      <span className="text-small">
        {row.mentees.length > 0 ? row.mentees.join(', ') : 'No mentees assigned yet'}
      </span>
    ),
  },
  { key: 'when', header: 'When', render: () => muted },
  { key: 'mode', header: 'Mode', render: () => null },
  { key: 'place', header: 'Meet or place', render: () => null },
  { key: 'recording', header: 'Recording', render: () => null },
]

// Where and when each 1:1 group meets for a peer mentorship task (SA-GroupMeetings). The
// groups come from the cohort; their chosen meetings aren't in the API yet.
export function GroupMeetingsScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
  onTaskChange,
}: GroupMeetingsScreenProps) {
  const task = data?.tasks.find((item) => item.id === data.selectedTaskId) ?? null
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Group meetings"
        action={
          data && data.tasks.length > 0 && data.selectedTaskId ? (
            <div className="w-full md:w-64">
              <Select
                label="Task"
                value={data.selectedTaskId}
                onChange={(event) => onTaskChange(event.target.value)}
                options={data.tasks.map((item) => ({ value: item.id, label: item.title }))}
              />
            </div>
          ) : undefined
        }
      />
      {!hasCohort ? (
        <NoCohortCard />
      ) : (
        <>
          <section aria-label="Summary" className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            <StatTile
              label="Groups"
              value={data ? data.groups.length : null}
              isLoading={isLoading && !data}
            />
            <StatTile label="Meeting set" value={null} emptyLabel={NOT_AVAILABLE} />
            <StatTile
              label="Not set yet"
              value={null}
              emptyLabel={NOT_AVAILABLE}
              note={task ? `Due ${formatDateTime(task.dueAt)}` : undefined}
            />
            <StatTile label="Virtual" value={null} emptyLabel={NOT_AVAILABLE} />
          </section>
          <Card flush>
            <DataTable
              label="Group meetings"
              columns={COLUMNS}
              rows={data?.groups ?? []}
              rowKey={(row) => row.peerMentorId}
              isLoading={isLoading}
              error={error}
              onRetry={onRetry}
              pageSize={20}
              empty={{
                icon: 'users',
                title: 'No 1:1 groups yet',
              }}
            />
          </Card>
        </>
      )}
    </div>
  )
}
