'use client'

import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Notice } from '@/components/ui/Notice'
import { Steps } from '@/components/ui/Steps'
import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table'
import { useActiveCohort } from '@/hooks/useActiveCohort'

interface ArchiveImportPageProps {
  cohortId: string
}

const STEPS = [
  {
    title: 'Upload the Airtable export',
    description: 'Users, sessions, attendance and extra activities. Not available yet.',
  },
  {
    title: 'Match the columns',
    description: 'Check that each column in the export matches a field here. Not available yet.',
  },
  {
    title: 'Check the numbers',
    description:
      "Compare each mentee's attended sessions, points and rates against the Airtable figures before you archive.",
  },
]

// The API has no archive import or reconciliation routes yet. The page shows the
// three steps and an empty reconciliation table; every action is disabled.
export function ArchiveImportPage({ cohortId }: ArchiveImportPageProps) {
  const { cohorts } = useActiveCohort()
  const name = cohorts.find((c) => c.id === cohortId)?.name ?? 'this cohort'

  return (
    <>
      <BackLink href="/admin/cohorts">Back to all cohorts</BackLink>
      <PageHeader
        title={`Import ${name} archive`}
        subtitle={`Bring ${name}'s earlier data in as a read-only record, and check the calculations against it.`}
      />
      <Notice variant="info">
        Archive import and reconciliation are not available yet. Nothing on this page uploads or
        changes data.
      </Notice>
      <Card>
        <Steps steps={STEPS} />
        <Button variant="secondary" className="mt-5" disabled>
          Upload export
        </Button>
      </Card>
      <Card
        flush
        title="Reconciliation"
        action={
          <div className="flex gap-2" role="group" aria-label="Show">
            <Chip variant="on" pressed onClick={() => undefined} disabled>
              All
            </Chip>
            <Chip onClick={() => undefined} disabled>
              Differences only
            </Chip>
          </div>
        }
      >
        <Table label="Reconciliation">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Mentee</TableHeaderCell>
              <TableHeaderCell num>Attended, Airtable</TableHeaderCell>
              <TableHeaderCell num>Attended, imported</TableHeaderCell>
              <TableHeaderCell num>Points, Airtable</TableHeaderCell>
              <TableHeaderCell num>Points, imported</TableHeaderCell>
              <TableHeaderCell>Result</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>{null}</TableBody>
        </Table>
        <EmptyState
          title="Nothing to reconcile yet"
          description="Once an export is imported, each mentee's figures show here side by side."
        />
      </Card>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <Button variant="secondary" disabled>
          Download differences
        </Button>
        <Button disabled>Archive {name}</Button>
      </div>
    </>
  )
}
