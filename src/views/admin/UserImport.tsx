'use client'

import { useRef, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Notice } from '@/components/ui/Notice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useCsvImport } from '@/hooks/useCsvImport'
import { useToast } from '@/hooks/useToast'
import { cx } from '@/lib/cx'
import { PROFILE_COLUMNS, type ImportRow } from '@/lib/csvImport'
import { plural } from '@/lib/format'
import { roleLabel } from '@/lib/roles'
import type { BulkInviteResultEntry } from '@/types/auth'

const FIRST_ROWS = 10

const PROFILE_HEADERS: Record<(typeof PROFILE_COLUMNS)[number], string> = {
  university: 'University',
  programme: 'Programme',
  degree_level: 'Degree level',
  gender: 'Gender',
  phone: 'Phone',
}

interface RowStatusProps {
  row: ImportRow
  result: BulkInviteResultEntry | undefined
}

function RowStatus({ row, result }: RowStatusProps) {
  if (result) {
    return result.success ? (
      <Chip variant="ok">Sent</Chip>
    ) : (
      <div className="flex flex-col gap-1">
        <Chip variant="err">Not sent</Chip>
        {result.message && (
          <span className="font-sans text-caption text-danger-text">{result.message}</span>
        )}
      </div>
    )
  }
  return row.problems.length > 0 ? <Chip variant="err">Fix</Chip> : <Chip>Ready</Chip>
}

export function UserImportPage() {
  const { showToast } = useToast()
  const { cohort, cohortId } = useActiveCohort()
  const csv = useCsvImport(cohortId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showAll, setShowAll] = useState(false)

  const rows = csv.parsed?.rows ?? []
  const visible = showAll ? rows : rows.slice(0, FIRST_ROWS)
  const resultFor = (email: string) =>
    csv.result?.results.find((r) => r.email.toLowerCase() === email)

  const chooseFile = () => inputRef.current?.click()

  const send = async () => {
    const result = await csv.send()
    if (!result) return
    showToast(
      result.failed === 0
        ? `${plural(result.successful, 'invitation')} sent.`
        : `${plural(result.successful, 'invitation')} sent, ${result.failed} not sent.`,
      result.failed === 0 ? 'success' : 'info'
    )
  }

  const subtitle = csv.parsed
    ? csv.parsed.fileError
      ? `${csv.fileName}: this file can't be imported.`
      : `${csv.fileName}: ${plural(rows.length, 'row')}. ${csv.readyCount} ready, ${csv.problemCount} need fixing.`
    : `Invite accepted mentees to ${cohort?.name ?? 'the cohort'} from a spreadsheet.`

  return (
    <>
      <BackLink href="/admin/users">Back to users</BackLink>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void csv.readFile(file)
          e.target.value = ''
          setShowAll(false)
        }}
      />
      <PageHeader
        title="Import mentees"
        subtitle={subtitle}
        action={
          csv.parsed && (
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={chooseFile} disabled={csv.isSending}>
                Upload a different file
              </Button>
              {!csv.result && (
                <Button
                  onClick={() => void send()}
                  isLoading={csv.isSending}
                  disabled={csv.readyCount === 0 || !cohortId}
                >
                  Send {plural(csv.readyCount, 'invitation')}
                </Button>
              )}
            </div>
          )
        }
      />

      <Notice variant="info">
        ICT track and peer mentor aren&apos;t part of the import. Mentees choose their ICT track
        later on their dashboard, and 1:1 peer mentors are assigned about a month into the cohort.
      </Notice>
      <Notice variant="warning">
        The columns sent are email, first_name, last_name and roles (separated by a semicolon,
        mentee when blank). A name column is split into first and last name. University, programme,
        degree level, gender and phone are checked here but not saved: not available yet.
      </Notice>

      {!cohortId && (
        <Notice variant="danger">
          Create a cohort first. Imported mentees join the active cohort.
        </Notice>
      )}
      {csv.sendError && <Notice variant="danger">{csv.sendError}</Notice>}
      {csv.result && (
        <Notice variant={csv.result.failed === 0 ? 'success' : 'warning'}>
          {plural(csv.result.successful, 'invitation')} sent to {cohort?.name ?? 'the cohort'}.
          {csv.result.failed > 0 && ` ${csv.result.failed} not sent. The reasons are in the table.`}
        </Notice>
      )}

      <Card flush>
        {!csv.parsed ? (
          <EmptyState
            icon="upload"
            title="Upload a CSV file"
            description="The first row must be the column names. Every row is checked here before anything is sent."
            action={<Button onClick={chooseFile}>Choose a CSV file</Button>}
          />
        ) : csv.parsed.fileError ? (
          <EmptyState
            icon="alert"
            title="This file can't be imported"
            description={csv.parsed.fileError}
            action={<Button onClick={chooseFile}>Choose another file</Button>}
          />
        ) : (
          <>
            <Table label="Rows in the file">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                  {PROFILE_COLUMNS.map((c) => (
                    <TableHeaderCell key={c}>{PROFILE_HEADERS[c]}</TableHeaderCell>
                  ))}
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((row) => {
                  const result = resultFor(row.email)
                  const hasProblem = row.problems.length > 0 || result?.success === false
                  return (
                    <TableRow key={row.line} className={cx(hasProblem && 'bg-danger-bg')}>
                      <TableCell className="whitespace-nowrap">
                        {`${row.firstName} ${row.lastName}`.trim() || (
                          <span className="text-danger-text">Blank</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cx(
                            row.problems.some(
                              (p) => p.startsWith('Email') || p.startsWith('This email')
                            ) && 'font-semibold text-danger-text'
                          )}
                        >
                          {row.email || 'Blank'}
                        </span>
                        {row.problems.map((p) => (
                          <p key={p} className="font-sans text-caption text-danger-text">
                            {p}
                          </p>
                        ))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {row.roles.map(roleLabel).join(', ')}
                      </TableCell>
                      {PROFILE_COLUMNS.map((c) => (
                        <TableCell key={c} className="text-text-secondary">
                          {row.profile[c] ?? <span className="text-text-muted">Blank</span>}
                        </TableCell>
                      ))}
                      <TableCell>
                        <RowStatus row={row} result={result} />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {rows.length > FIRST_ROWS && (
              <div className="px-4 py-2 md:px-6">
                <Button variant="secondary" size="sm" onClick={() => setShowAll((v) => !v)}>
                  {showAll ? 'Show fewer rows' : `Show all ${rows.length} rows`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  )
}
