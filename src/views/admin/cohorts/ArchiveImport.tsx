'use client'

import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useArchiveCohort } from '@/hooks/useArchiveCohort'
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

// The API has no archive import or reconciliation routes yet, so those steps and the empty
// reconciliation table are disabled. Archiving a closed or imported cohort works.
export function ArchiveImportPage({ cohortId }: ArchiveImportPageProps) {
  const { cohorts } = useActiveCohort()
  const name = cohorts.find((c) => c.id === cohortId)?.name ?? 'this cohort'
  const archive = useArchiveCohort(cohortId)
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <>
      <BackLink href="/admin/cohorts">Back to all cohorts</BackLink>
      <PageHeader
        title={`Import ${name} archive`}
        subtitle={`Bring ${name}'s earlier data in as a read-only record, and check the calculations against it.`}
      />
      <Notice variant="info">
        Archive import and reconciliation are not available yet. Nothing on this page uploads data.
      </Notice>
      {archive.isArchived && <Notice>{name} is archived, so it is a read-only record.</Notice>}
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
        <EmptyState title="Nothing to reconcile yet" />
      </Card>
      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <Button variant="secondary" disabled>
          Download differences
        </Button>
        <Button
          onClick={() => setIsConfirming(true)}
          disabled={!archive.canArchive}
          title={archive.canArchive ? undefined : 'Close the cohort first'}
        >
          Archive {name}
        </Button>
      </div>
      <ConfirmDialog
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        title={`Archive ${name}?`}
        confirmLabel="Archive cohort"
        isLoading={archive.isArchiving}
        error={archive.error}
        onConfirm={() => {
          void archive.archive().then((done) => {
            if (done) setIsConfirming(false)
          })
        }}
      >
        <p>It becomes a read-only record. Alumni and cross-cohort comparisons keep using it.</p>
      </ConfirmDialog>
    </>
  )
}
