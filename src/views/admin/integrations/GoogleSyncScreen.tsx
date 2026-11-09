import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatTile } from '@/components/ui/StatTile'

const NOT_AVAILABLE = 'Not available yet'

const TILES: { label: string; note?: string }[] = [
  { label: 'In sync' },
  { label: 'Waiting', note: 'Sent within 5 minutes' },
  { label: 'Failed' },
  { label: 'Edited in Google', note: 'Undone at the daily check, 3:00 AM' },
]

// Sessions and meetings waiting, failed or out of step with Google Calendar and Meet
// (SA-GoogleSync). The API has no sync status yet, so every part shows Not available yet.
export function GoogleSyncScreen() {
  return (
    <>
      <PageHeader
        title="Google sync"
        subtitle="Sessions and meetings the MMS sends to Google Calendar and Meet. The MMS is the source of truth."
        action={
          <div className="flex flex-col items-end gap-1">
            <Button variant="secondary" disabled>
              Retry failed items
            </Button>
            <span className="font-sans text-caption text-text-muted">{NOT_AVAILABLE}</span>
          </div>
        }
      />
      <section aria-label="Sync status" className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
        {TILES.map((tile) => (
          <StatTile
            key={tile.label}
            label={tile.label}
            value={null}
            emptyLabel={NOT_AVAILABLE}
            note={tile.note}
          />
        ))}
      </section>
      <Card title="Needs attention">
        <EmptyState icon="calendar" title="Sync status" description={NOT_AVAILABLE} />
      </Card>
      <Card title="Calendars">
        <EmptyState
          icon="calendar"
          title="Cohort and track calendars"
          description={NOT_AVAILABLE}
        />
      </Card>
    </>
  )
}
