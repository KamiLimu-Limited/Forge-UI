'use client'

import { useRouter } from 'next/navigation'
import { StatusChip } from '@/components/forge/StatusChip'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useCohortsOverview, type CohortOverviewRow } from '@/hooks/useCohortsOverview'
import { formatLongDate } from '@/lib/format'

export function CohortsPage() {
  const router = useRouter()
  const { setCohortId } = useActiveCohort()
  const overview = useCohortsOverview()

  const openSettings = (id: string) => {
    setCohortId(id)
    router.push('/admin/settings')
  }

  const columns: DataTableColumn<CohortOverviewRow>[] = [
    {
      key: 'name',
      header: 'Cohort',
      render: (row) => <span className="font-semibold">{row.cohort.name}</span>,
      sortValue: (row) => row.cohort.name,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusChip kind="cohort" status={row.cohort.status} />,
      sortValue: (row) => row.cohort.status,
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (row) => (
        <span className="whitespace-nowrap">
          {formatLongDate(row.cohort.start_date)} to {formatLongDate(row.cohort.end_date)}
        </span>
      ),
      sortValue: (row) => row.cohort.start_date,
    },
    {
      key: 'mentees',
      header: 'Mentees',
      num: true,
      render: (row) => row.mentees ?? <span className="text-text-muted">No data</span>,
      sortValue: (row) => row.mentees ?? -1,
    },
    {
      key: 'rate',
      header: 'Core attendance rate',
      num: true,
      render: (row) =>
        row.coreRate === null ? (
          <span className="text-text-muted">No data yet</span>
        ) : (
          `${Math.round(row.coreRate * 100)}%`
        ),
      sortValue: (row) => row.coreRate ?? -1,
    },
    {
      key: 'actions',
      header: 'Actions',
      alignEnd: true,
      render: (row) =>
        row.cohort.status === 'completed' ? (
          <ButtonLink
            variant="secondary"
            size="sm"
            href={`/admin/cohorts/${row.cohort.id}/archive-import`}
          >
            Import and reconciliation
          </ButtonLink>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openSettings(row.cohort.id)}
            aria-label={`Settings for ${row.cohort.name}`}
          >
            Settings
          </Button>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title="All cohorts"
        subtitle="Every cohort in the system. Archived cohorts are read only."
        action={<ButtonLink href="/admin/cohorts/new">New cohort</ButtonLink>}
      />
      <Card flush>
        <DataTable
          label="Cohorts"
          columns={columns}
          rows={overview.rows}
          rowKey={(row) => row.cohort.id}
          isLoading={overview.isLoading}
          error={overview.error}
          onRetry={overview.refetch}
          initialSort={{ key: 'dates', direction: 'desc' }}
          empty={{
            title: 'No cohorts yet',
            description: 'Create the first cohort to start adding sessions and people.',
            action: <ButtonLink href="/admin/cohorts/new">New cohort</ButtonLink>,
          }}
        />
      </Card>
      <p className="font-sans text-caption text-text-muted">
        Earlier cohorts can be imported as a read-only archive and used to check the attendance and
        points calculations.
      </p>
    </>
  )
}
