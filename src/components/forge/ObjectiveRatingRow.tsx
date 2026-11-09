import { RatingScale } from '@/components/ui/RatingScale'
import { cx } from '@/lib/cx'
import type { ObjectiveRow, RatingWindowView } from '@/types/menteeObjectives'

interface ObjectiveRatingRowProps {
  objective: ObjectiveRow
  windows: RatingWindowView[]
  value: number | undefined
  onChange: (value: number) => void
  error?: string
}

// One objective with its Start, Mid and End. The open point becomes a 1 to 5 scale, which
// phones hide once a rating is saved, and
// `order` keeps it in its column from md up, since the scale is drawn after the tiles.
// Tiles above the scale on phones; one row of columns from md up.
export function ObjectiveRatingRow({
  objective,
  windows,
  value,
  onChange,
  error,
}: ObjectiveRatingRowProps) {
  const openIndex = windows.findIndex((window) => window.isOpen)
  const open = windows[openIndex]

  return (
    <div className="flex flex-col gap-2.5 border-b border-border py-3.5 last:border-b-0 md:flex-row md:items-center md:gap-4">
      <p className="font-sans text-body font-semibold text-text-primary md:-order-1 md:flex-1">
        {objective.label}
      </p>
      <div className="grid grid-cols-3 gap-2 md:contents">
        {windows.map((window, index) => {
          const score = objective.scores[window.point]
          return (
            <div
              key={window.point}
              style={{ order: index }}
              className={cx(
                'flex flex-col items-center rounded-md p-2 md:w-20 md:bg-transparent md:p-0 md:outline-none',
                window.isOpen
                  ? 'bg-accent-bg outline outline-1 outline-primary md:hidden'
                  : 'bg-background'
              )}
            >
              <span className="font-sans text-tab text-text-secondary md:hidden">
                {window.label}
              </span>
              {score !== null || window.isOpen ? (
                <span className="font-mono text-subheading font-semibold tabular-nums text-text-primary">
                  {score ?? '?'}
                </span>
              ) : window.opensLabel ? (
                <>
                  <span className="font-mono text-subheading font-semibold text-text-muted md:hidden">
                    {window.opensLabel}
                  </span>
                  <span className="hidden text-center font-sans text-caption text-text-muted md:inline">
                    Opens {window.opensLabel}
                  </span>
                </>
              ) : (
                <span className="text-center font-sans text-caption text-text-muted">Not open</span>
              )}
            </div>
          )
        })}
      </div>
      {open && (
        <div
          style={{ order: openIndex }}
          className={cx('md:block md:w-64', objective.scores[open.point] !== null && 'hidden')}
        >
          <RatingScale
            compact
            question={`${open.label} rating for ${objective.label}`}
            value={value}
            onChange={onChange}
            error={error}
          />
        </div>
      )}
    </div>
  )
}
