'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAuditLookups } from '@/hooks/useAuditLookups'
import { useAuditTrail } from '@/hooks/useAuditTrail'
import { auditAction, auditActor, auditRecord } from '@/lib/audit'
import { formatDateTime } from '@/lib/format'
import { AUDIT_RESOURCE_FILTERS } from '@/lib/labels'
import type { AuditLogResponse } from '@/types/audit'

const PAGE_SIZE = 20
const GRADUATION = 'graduation'

export function AuditTrailPage() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const userId = params.get('user_id')
  const [page, setPage] = useState(1)
  const [resourceType, setResourceType] = useState<string | null>(null)
  const [since, setSince] = useState('')
  const [search, setSearch] = useState('')

  const trail = useAuditTrail({
    page,
    pageSize: PAGE_SIZE,
    userId,
    resourceType,
    since: since || null,
  })
  const lookups = useAuditLookups(trail.logs)

  // The person filter lives in the URL so "See this user's changes" links work
  const setUserId = (id: string) => {
    setPage(1)
    router.replace(id ? `${pathname}?user_id=${id}` : pathname)
  }

  const term = search.trim().toLowerCase()
  const rows = term
    ? trail.logs.filter((log) =>
        `${auditAction(log)} ${auditRecord(log, lookups)} ${auditActor(log, lookups)}`
          .toLowerCase()
          .includes(term)
      )
    : trail.logs

  const columns: DataTableColumn<AuditLogResponse>[] = [
    {
      key: 'when',
      header: 'When',
      render: (log) => (
        <span className="whitespace-nowrap font-mono text-caption">
          {formatDateTime(log.created_at)}
        </span>
      ),
    },
    { key: 'who', header: 'Who', render: (log) => auditActor(log, lookups) },
    {
      key: 'action',
      header: 'Action',
      render: (log) => <span className="whitespace-nowrap">{auditAction(log)}</span>,
    },
    {
      key: 'record',
      header: 'Record',
      render: (log) => <span className="text-text-secondary">{auditRecord(log, lookups)}</span>,
    },
  ]

  const person = trail.people.find((p) => p.id === userId)

  return (
    <>
      <PageHeader
        title="Audit trail"
        subtitle={
          person
            ? `Every change made by ${person.name}, newest first.`
            : 'Every administrative change, newest first.'
        }
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input
          type="search"
          aria-label="Search changes on this page"
          placeholder="Search changes on this page"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          aria-label="Who"
          options={[
            { value: '', label: 'All people' },
            ...trail.people.map((p) => ({ value: p.id, label: p.name })),
          ]}
          value={userId ?? ''}
          onChange={(e) => setUserId(e.target.value)}
        />
        <div className="relative">
          <select
            aria-label="Action"
            value={resourceType ?? ''}
            onChange={(e) => {
              setResourceType(e.target.value || null)
              setPage(1)
            }}
            className="h-control w-full rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary"
          >
            <option value="">All actions</option>
            {AUDIT_RESOURCE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
            <option value={GRADUATION} disabled>
              Graduation (not available yet)
            </option>
          </select>
        </div>
        <Input
          type="date"
          aria-label="Changes since"
          value={since}
          onChange={(e) => {
            setSince(e.target.value)
            setPage(1)
          }}
        />
      </div>
      <Card flush>
        <DataTable
          label="Audit trail"
          columns={columns}
          rows={rows}
          rowKey={(log) => log.id}
          isLoading={trail.isLoading}
          error={trail.error}
          onRetry={trail.refetch}
          empty={{
            icon: 'search',
            title: term ? 'Nothing on this page matches' : 'No changes found',
            description: term
              ? 'Search looks at the page shown. Try another page or clear the search.'
              : 'Try clearing the filters.',
          }}
          pagination={{ page, pageSize: PAGE_SIZE, total: trail.total, onPageChange: setPage }}
        />
      </Card>
    </>
  )
}
