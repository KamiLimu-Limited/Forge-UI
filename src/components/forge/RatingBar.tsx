import { ProgressBar } from '@/components/ui/ProgressBar'

interface RatingBarProps {
  label: string
  // Out of 5, null when nobody has answered yet
  average: number | null
}

// One question's average rating as a bar out of 5
export function RatingBar({ label, average }: RatingBarProps) {
  return (
    <div className="flex flex-col gap-1 md:grid md:grid-cols-5 md:items-center md:gap-4">
      <span className="font-sans text-small text-text-primary md:col-span-2">{label}</span>
      <div className="flex items-center gap-3 md:col-span-3">
        <ProgressBar
          value={average === null ? 0 : (average / 5) * 100}
          label={`${label}, ${average === null ? 'no answers yet' : `${average.toFixed(1)} out of 5`}`}
          className="flex-1"
        />
        <span className="w-8 shrink-0 text-right font-mono text-small font-semibold text-text-primary">
          {average === null ? '-' : average.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
