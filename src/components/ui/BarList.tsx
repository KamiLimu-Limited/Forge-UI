import { ProgressBar } from './ProgressBar'

export interface BarListItem {
  label: string
  value: number
  // The number shown at the end of the row, such as "88%" or "96"
  display: string
}

interface BarListProps {
  items: BarListItem[]
  // The value a full bar stands for: 100 for rates, the largest count for counts
  max: number
}

// Rows of label, bar and number. The label sits above the bar on phones and beside it
// from md up.
export function BarList({ items, max }: BarListProps) {
  const top = max > 0 ? max : 1
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.label}
          className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 md:grid-cols-[minmax(0,theme(spacing.48))_1fr_auto]"
        >
          <span className="truncate font-sans text-small text-text-primary">{item.label}</span>
          <span className="font-mono text-small font-semibold text-text-primary md:order-last">
            {item.display}
          </span>
          <ProgressBar
            value={(item.value / top) * 100}
            label={`${item.label}, ${item.display}`}
            className="col-span-2 md:col-span-1"
          />
        </li>
      ))}
    </ul>
  )
}
