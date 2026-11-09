import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { formatDay } from '@/lib/format'
import type { ProSessionRow, ProSessionsView } from '@/types/proMentor'

interface ProResourcesScreenProps {
  // null until the data loads
  data: ProSessionsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  linkFor: (row: ProSessionRow) => string
  onLinkChange: (sessionId: string, value: string) => void
  onSave: (row: ProSessionRow) => void
  savingId?: string | null
  fieldErrors?: Record<string, string>
}

// Each session's Google Drive folder link, editable before and after the session. This
// only draws the screen; the page's hook saves.
export function ProResourcesScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  linkFor,
  onLinkChange,
  onSave,
  savingId = null,
  fieldErrors = {},
}: ProResourcesScreenProps) {
  const rows = data ? [...data.upcoming, ...data.past] : []
  const pastIds = new Set(data?.past.map((row) => row.id) ?? [])
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Resources"
        subtitle="Link the Google Drive folder with your materials. You can update it before and after the session."
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your sessions" />
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            icon="inbox"
            title="No sessions yet"
            description="Sessions show here once the System Admin assigns you to one."
          />
        </Card>
      ) : (
        <Card flush>
          <ul className="flex flex-col">
            {rows.map((row) => {
              const saved = row.materialsUrl ?? ''
              const value = linkFor(row)
              return (
                <li
                  key={row.id}
                  id={`session-${row.id}`}
                  className="flex scroll-mt-24 flex-col gap-3 border-b border-border p-4 last:border-b-0 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-end md:gap-5 md:px-6"
                >
                  <div className="flex flex-col gap-0.5 md:self-center">
                    <p className="font-sans text-body font-semibold text-text-primary">
                      {row.title}
                    </p>
                    <p className="font-sans text-small text-text-muted">
                      {formatDay(row.startsAt)}
                      {pastIds.has(row.id) ? ', past' : ''}
                    </p>
                  </div>
                  <Input
                    label="Resource link"
                    type="url"
                    inputMode="url"
                    placeholder="Paste a Google Drive link"
                    value={value}
                    onChange={(event) => onLinkChange(row.id, event.target.value)}
                    error={fieldErrors[row.id]}
                  />
                  <Button
                    variant={value.trim() !== saved ? 'primary' : 'secondary'}
                    onClick={() => onSave(row)}
                    isLoading={savingId === row.id}
                    disabled={value.trim() === saved}
                  >
                    Save link
                  </Button>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </div>
  )
}
