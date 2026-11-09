import { cx } from '@/lib/cx'

interface ProgressBarProps {
  // 0 to 100. Anything outside that range is clamped.
  value: number
  // Names the bar for screen readers, for example "ICT attendance rate"
  label: string
  className?: string
  // The filled part's colour; teal unless a chart needs a second series
  barClassName?: string
}

export function ProgressBar({ value, label, className, barClassName }: ProgressBarProps) {
  const percent = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cx('h-2 w-full overflow-hidden rounded-full bg-border', className)}
    >
      <div
        className={cx('h-full rounded-full', barClassName ?? 'bg-teal-500')}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
