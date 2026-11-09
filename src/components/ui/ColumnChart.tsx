import { cx } from '@/lib/cx'

export interface ColumnChartItem {
  label: string
  // null for a column with no data yet, such as a month still to come
  value: number | null
  // The number shown above the column, such as "92%"
  display: string
}

interface ColumnChartProps {
  // Names the chart for screen readers, for example "Core attendance by month"
  label: string
  items: ColumnChartItem[]
  // The value a full-height column stands for, such as 100 for a rate
  max: number
  className?: string
}

// Vertical columns with the value above each and its label below. Screen readers get the
// same numbers as a list, so nothing depends on seeing the bars.
export function ColumnChart({ label, items, max, className }: ColumnChartProps) {
  const top = max > 0 ? max : 1
  return (
    <figure className={cx('flex flex-col gap-2', className)}>
      <ul className="sr-only" aria-label={label}>
        {items.map((item) => (
          <li key={item.label}>
            {item.label}: {item.value === null ? 'no data yet' : item.display}
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="flex h-48 items-end gap-2 border-b border-border md:gap-3">
        {items.map((item) => {
          const percent = item.value === null ? 0 : Math.min(100, (item.value / top) * 100)
          return (
            <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-1">
              <span className="text-center font-mono text-caption font-semibold text-text-primary">
                {item.value === null ? '' : item.display}
              </span>
              <div
                className={cx(
                  'w-full rounded-t-md',
                  item.value === null ? 'bg-transparent' : 'bg-teal-500'
                )}
                style={{ height: `${percent}%` }}
              />
            </div>
          )
        })}
      </div>
      <div aria-hidden="true" className="flex gap-2 md:gap-3">
        {items.map((item) => (
          <span
            key={item.label}
            className="min-w-0 flex-1 truncate text-center font-sans text-caption text-text-muted"
          >
            {item.label}
          </span>
        ))}
      </div>
    </figure>
  )
}
