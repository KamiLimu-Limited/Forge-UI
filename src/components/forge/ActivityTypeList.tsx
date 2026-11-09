import { ButtonLink } from '@/components/ui/ButtonLink'
import { plural } from '@/lib/format'
import { menteeActivityFormRoute } from '@/lib/menteeRoutes'
import type { ActivityTile } from '@/types/menteeActivities'

interface ActivityTypeListProps {
  tiles: ActivityTile[]
}

// The five kinds of log with their counts. Rows in one card on phones, separate cards from md up.
export function ActivityTypeList({ tiles }: ActivityTypeListProps) {
  return (
    <section
      aria-label="Log types"
      className="rounded-lg border border-border bg-surface px-4 shadow-card md:grid md:grid-cols-3 md:gap-4 md:border-0 md:bg-transparent md:px-0 md:shadow-none xl:grid-cols-5"
    >
      {tiles.map((tile) => (
        <div
          key={tile.kind}
          className="flex items-center gap-3 border-b border-border py-3 last:border-b-0 md:flex-col md:items-stretch md:rounded-lg md:border md:bg-surface md:p-4 md:shadow-card md:last:border-b"
        >
          <span className="w-8 shrink-0 font-mono text-section font-semibold tabular-nums text-text-primary md:order-2 md:w-auto md:text-stat">
            {tile.count}
          </span>
          <div className="min-w-0 flex-1 md:contents">
            <h2 className="font-sans text-body font-semibold text-text-primary md:order-1 md:min-h-12">
              {tile.label}
            </h2>
            <p className="font-sans text-small text-text-secondary md:order-3">
              {tile.count === 0 ? 'None logged yet' : plural(tile.points, 'point')}
            </p>
          </div>
          <div className="shrink-0 md:order-4">
            <ButtonLink
              href={menteeActivityFormRoute(tile.kind)}
              variant="secondary"
              size="sm"
              aria-label={`Add to ${tile.label}`}
              className="md:w-full"
            >
              Add
            </ButtonLink>
          </div>
        </div>
      ))}
    </section>
  )
}
