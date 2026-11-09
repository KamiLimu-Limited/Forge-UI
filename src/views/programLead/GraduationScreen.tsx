'use client'

import { useState } from 'react'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Modal } from '@/components/ui/Modal'
import { Notice } from '@/components/ui/Notice'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { StatTile } from '@/components/ui/StatTile'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { TextLink } from '@/components/ui/TextLink'
import type { ConfirmFields } from '@/hooks/useGraduation'
import { PROGRAM_LEAD_ROUTES, graduationSequenceRoute } from '@/lib/adminRoutes'
import { formatDateTime, formatLongDate } from '@/lib/format'
import type { GraduateRow, GraduationPreviewView } from '@/types/graduation'

const NOT_AVAILABLE = 'Not available yet'
const FIRST_SHOWN = 6

interface GraduationScreenProps {
  // null until the data loads
  data: GraduationPreviewView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  // Graduating, the reveal order and corrections are the Program Lead's alone
  isProgramLead: boolean
  search: string
  onSearch: (value: string) => void
  // Graduates matching the search
  graduates: GraduateRow[]
  canGraduate: boolean
  onRefresh: () => void
  confirmFields: ConfirmFields
  onConfirmFieldsChange: (changes: Partial<ConfirmFields>) => void
  onResetConfirm: () => void
}

function MenteeTable({ rows, label }: { rows: GraduateRow[]; label: string }) {
  return (
    <Table label={label}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>University</TableHeaderCell>
          <TableHeaderCell num>Core attendance rate</TableHeaderCell>
          <TableHeaderCell num>Total points</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>
              {row.university ?? <span className="text-text-muted">{NOT_AVAILABLE}</span>}
            </TableCell>
            <TableCell num>{Math.round(row.coreRate)}%</TableCell>
            <TableCell num>{row.totalPoints}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// Confirming takes the cohort name typed in and the Program Lead's password. The API can't
// confirm a graduation or re-check a password yet, so Confirm graduation stays disabled.
function ConfirmGraduationDialog({
  data,
  isOpen,
  onClose,
  fields,
  onChange,
}: {
  data: GraduationPreviewView
  isOpen: boolean
  onClose: () => void
  fields: ConfirmFields
  onChange: (changes: Partial<ConfirmFields>) => void
}) {
  const nameMatches = fields.cohortName.trim() === data.cohortName
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Graduate ${data.cohortName}`}
      width="md"
      footer={
        <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex flex-col gap-1">
            <Button disabled>Confirm graduation</Button>
            <span className="font-sans text-caption text-text-muted">{NOT_AVAILABLE}</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="font-sans text-body text-text-secondary">
          {data.graduates.length} mentees will graduate and receive alumni status.{' '}
          {data.nonGraduates.length} mentees will see their final result privately on their
          dashboard.
        </p>
        <Notice variant="warning">
          This is final. After you confirm, results are frozen and the graduation sequence starts.
          Later corrections can only be made by the Program Lead and are recorded.
        </Notice>
        <Input
          label="Type the cohort name to confirm"
          value={fields.cohortName}
          onChange={(event) => onChange({ cohortName: event.target.value })}
          error={fields.cohortName && !nameMatches ? `Type ${data.cohortName} exactly` : undefined}
          autoComplete="off"
        />
        <PasswordInput
          label="Your password"
          id="confirm-graduation-password"
          value={fields.password}
          onChange={(event) => onChange({ password: event.target.value })}
          autoComplete="current-password"
        />
      </div>
    </Modal>
  )
}

function CloseCohortDialog({
  data,
  isOpen,
  onClose,
  fields,
  onChange,
}: {
  data: GraduationPreviewView
  isOpen: boolean
  onClose: () => void
  fields: ConfirmFields
  onChange: (changes: Partial<ConfirmFields>) => void
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Close ${data.cohortName}`}
      width="md"
      footer={
        <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex flex-col gap-1">
            <Button disabled>Close cohort</Button>
            <span className="font-sans text-caption text-text-muted">{NOT_AVAILABLE}</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="font-sans text-body text-text-secondary">
          Closing makes the cohort read only. Peer mentor assignments are archived, and every record
          stays available for alumni and cross-cohort comparison.
        </p>
        <Notice variant="warning">You can&apos;t reopen a closed cohort.</Notice>
        <Input
          label="Type the cohort name to confirm"
          value={fields.cohortName}
          onChange={(event) => onChange({ cohortName: event.target.value })}
          autoComplete="off"
        />
      </div>
    </Modal>
  )
}

function Preview(props: GraduationScreenProps & { data: GraduationPreviewView }) {
  const { data, isProgramLead, graduates, search, onSearch, canGraduate, onRefresh } = props
  const [showAll, setShowAll] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const shown = showAll || search ? graduates : graduates.slice(0, FIRST_SHOWN)
  const closeConfirm = () => {
    setIsConfirmOpen(false)
    props.onResetConfirm()
  }

  return (
    <>
      <PageHeader
        title="Graduation preview"
        subtitle={`${data.cohortName} ${data.hasEnded ? 'ended' : 'ends'} on ${formatLongDate(data.endDate)}. Preview last calculated ${formatDateTime(data.calculatedAt)}.`}
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onRefresh}>
              Refresh calculation
            </Button>
            {isProgramLead && (
              <>
                <ButtonLink href={PROGRAM_LEAD_ROUTES.revealOrder} variant="secondary">
                  Set reveal order
                </ButtonLink>
                <Button disabled={!canGraduate} onClick={() => setIsConfirmOpen(true)}>
                  Graduate Cohort
                </Button>
              </>
            )}
          </div>
        }
      />
      {isProgramLead && !data.hasEnded && (
        <Notice>Graduate Cohort opens after the cohort end date.</Notice>
      )}
      <section aria-label="Summary" className="grid gap-4 md:grid-cols-3 md:gap-5">
        <StatTile
          label="Graduates"
          value={data.graduates.length}
          note={`Core attendance rate at or above ${data.threshold}%`}
        />
        <StatTile
          label="Non-graduates"
          value={data.nonGraduates.length}
          note={`Core attendance rate below ${data.threshold}%`}
        />
        <StatTile label="Threshold" value={`${data.threshold}%`} note="Set in cohort settings" />
      </section>
      <Card
        title={`Graduates (${data.graduates.length})`}
        action={
          <div className="w-full md:w-64">
            <Input
              label="Search"
              type="search"
              placeholder="Name"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
          </div>
        }
        flush
      >
        {graduates.length === 0 ? (
          <p className="px-4 py-6 font-sans text-small text-text-muted md:px-6">
            {search ? 'No graduates match that name' : 'No mentees meet the threshold yet'}
          </p>
        ) : (
          <>
            <MenteeTable rows={shown} label="Graduates" />
            {!search && graduates.length > FIRST_SHOWN && (
              <div className="px-4 py-3 md:px-6">
                <Button variant="secondary" size="sm" onClick={() => setShowAll((all) => !all)}>
                  {showAll ? 'Show fewer' : `Show all ${graduates.length}`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
      <Card
        title={`Non-graduates (${data.nonGraduates.length})`}
        action={
          <span className="font-sans text-small text-text-muted">
            Corrections such as an approved override or an excused absence are made by the System
            Admin before you confirm.
          </span>
        }
        flush
      >
        {data.nonGraduates.length === 0 ? (
          <p className="px-4 py-6 font-sans text-small text-text-muted md:px-6">
            Every mentee meets the threshold
          </p>
        ) : (
          <MenteeTable rows={data.nonGraduates} label="Non-graduates" />
        )}
      </Card>
      {isProgramLead && (
        <ConfirmGraduationDialog
          data={data}
          isOpen={isConfirmOpen}
          onClose={closeConfirm}
          fields={props.confirmFields}
          onChange={props.onConfirmFieldsChange}
        />
      )}
    </>
  )
}

function GraduatedRecord(props: GraduationScreenProps & { data: GraduationPreviewView }) {
  const { data, isProgramLead } = props
  const [isCloseOpen, setIsCloseOpen] = useState(false)
  const total = data.graduates.length + data.nonGraduates.length
  return (
    <>
      <PageHeader
        title={`${data.cohortName} graduated`}
        subtitle="Results are final."
        action={
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={graduationSequenceRoute(data.cohortId)} variant="secondary">
              Replay graduation
            </ButtonLink>
            <Button onClick={() => setIsCloseOpen(true)}>Close cohort</Button>
          </div>
        }
      />
      <section aria-label="Result" className="grid gap-4 md:grid-cols-3 md:gap-5">
        <StatTile label="Graduates" value={data.graduates.length} note="Now alumni" />
        <StatTile
          label="Did not graduate"
          value={data.nonGraduates.length}
          note="Saw their result privately"
        />
        <Card>
          <div className="flex flex-col gap-1">
            <p className="font-sans text-small text-text-secondary">Corrections since graduation</p>
            <p className="font-sans text-body text-text-muted">{NOT_AVAILABLE}</p>
            {isProgramLead && (
              <TextLink href={PROGRAM_LEAD_ROUTES.correction}>Correct a result</TextLink>
            )}
          </div>
        </Card>
      </section>
      <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-2">
        <Card title="Graduation record">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-sans text-small">
            <dt className="text-text-secondary">Confirmed by</dt>
            <dd className="text-text-muted">{NOT_AVAILABLE}</dd>
            <dt className="text-text-secondary">Confirmed on</dt>
            <dd className="text-text-muted">{NOT_AVAILABLE}</dd>
            <dt className="text-text-secondary">Threshold</dt>
            <dd className="text-text-primary">{data.threshold}% core attendance rate</dd>
            <dt className="text-text-secondary">Graduates</dt>
            <dd className="text-text-primary">
              {data.graduates.length} of {total}
            </dd>
          </dl>
        </Card>
        <Card title="Next step">
          <p className="font-sans text-small text-text-secondary">
            Close the cohort once the ceremony is over. Peer mentor assignments are archived and
            every record is kept for cross-cohort comparison.
          </p>
        </Card>
      </div>
      <Card title={`Graduates (${data.graduates.length})`} flush>
        <MenteeTable rows={data.graduates} label="Graduates" />
      </Card>
      <CloseCohortDialog
        data={data}
        isOpen={isCloseOpen}
        onClose={() => {
          setIsCloseOpen(false)
          props.onResetConfirm()
        }}
        fields={props.confirmFields}
        onChange={props.onConfirmFieldsChange}
      />
    </>
  )
}

// The graduation preview (PL-Graduation) before graduation, and the graduation record
// (PL-Graduated) after. This only draws the screen.
export function GraduationScreen(props: GraduationScreenProps) {
  const { data, isLoading = false, error = null, onRetry, hasCohort = true } = props
  if (!hasCohort) {
    return (
      <>
        <PageHeader title="Graduation preview" />
        <NoCohortNotice />
      </>
    )
  }
  if (error || isLoading || !data) {
    return (
      <>
        <PageHeader title="Graduation preview" />
        {error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : (
          <LoadingState label="Calculating the graduation preview" />
        )}
      </>
    )
  }
  return data.isGraduated ? (
    <GraduatedRecord {...props} data={data} />
  ) : (
    <Preview {...props} data={data} />
  )
}
